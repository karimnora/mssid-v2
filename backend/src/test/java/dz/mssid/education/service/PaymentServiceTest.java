package dz.mssid.education.service;

import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.Subscription;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.PaymentReceiptRepository;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.SubscriptionRepository;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentReceiptRepository receiptRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private AdminAuditLogService adminAuditLogService;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private User student;
    private Role freeRole;
    private Role premiumRole;

    @BeforeEach
    void setUp() {

        freeRole = new Role(1L, Role.RoleName.ROLE_FREE);
        premiumRole = new Role(2L, Role.RoleName.ROLE_PREMIUM);

        student = User.builder()
                .id(10L)
                .nom("Yassine")
                .email("yassine@mssid.dz")
                .role(freeRole)
                .build();
        lenient().when(userRepository.findForPayment(10L)).thenReturn(Optional.of(student));
    }

    @Test
    @DisplayName("submitReceipt - Saves new payment receipt successfully")
    void submitReceipt_Success() {
        ReceiptUploadRequest request = ReceiptUploadRequest.builder()
                .userEmail("yassine@mssid.dz")
                .paymentMethod("BARIDIMOB")
                .transactionRef("BM-12345")
                .amountDzd(900.0)
                .planId("P3M")
                .receiptImageUrl("https://mssid.dz/proof.png")
                .build();

        when(userRepository.findByEmail("yassine@mssid.dz")).thenReturn(Optional.of(student));
        when(receiptRepository.save(any(PaymentReceipt.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentReceipt result = paymentService.submitReceipt("yassine@mssid.dz", request);

        assertNotNull(result);
        assertEquals("BARIDIMOB", result.getPaymentMethod());
        assertEquals("BM-12345", result.getTransactionRef());
        assertEquals(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION, result.getStatus());
        verify(receiptRepository).save(any(PaymentReceipt.class));
        verify(adminAuditLogService).record(eq("yassine@mssid.dz"), eq("RECEIPT_SUBMITTED"), eq("RECEIPT"), any(), anyString(), eq("SUCCESS"));
    }

    @Test
    @DisplayName("New uploads must choose a plan; legacy receipts retain their stored annual duration")
    void submitReceipt_MissingPlan_Rejected() {
        when(userRepository.findByEmail(student.getEmail())).thenReturn(Optional.of(student));
        assertThrows(IllegalArgumentException.class, () -> paymentService.submitReceipt(student.getEmail(),
                ReceiptUploadRequest.builder().amountDzd(1500.0).receiptImageUrl("https://mssid.dz/proof.png").build()));
        verify(receiptRepository, never()).save(any());
    }

    // Regression test for the gap flagged in the payment-system audit: nothing used to confront a
    // submitted amount against the real subscription price before a receipt could be approved.
    @Test
    @DisplayName("submitReceipt - Rejects a submitted amount that doesn't match the real price")
    void submitReceipt_WrongAmount_Rejected() {
        ReceiptUploadRequest request = ReceiptUploadRequest.builder()
                .userEmail("yassine@mssid.dz")
                .paymentMethod("BARIDIMOB")
                .amountDzd(1.0)
                .planId("P3M")
                .receiptImageUrl("https://mssid.dz/proof.png")
                .build();

        when(userRepository.findByEmail("yassine@mssid.dz")).thenReturn(Optional.of(student));

        assertThrows(IllegalArgumentException.class, () -> paymentService.submitReceipt("yassine@mssid.dz", request));
        verify(receiptRepository, never()).save(any());
        verify(adminAuditLogService).record(eq("yassine@mssid.dz"), eq("RECEIPT_SUBMITTED"), eq("RECEIPT"), any(), anyString(), eq("FAILURE"));
    }

    @Test
    @DisplayName("verifyReceipt - Approval promotes student to ROLE_PREMIUM and opens a 1-year subscription")
    void verifyReceipt_Approve_PromotesUserToPremium() {
        PaymentReceipt pendingReceipt = PaymentReceipt.builder()
                .id(50L)
                .user(student)
                .status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION)
                .build();

        VerifyReceiptRequest verifyReq = new VerifyReceiptRequest();
        verifyReq.setApprove(true);

        when(receiptRepository.findForVerification(50L)).thenReturn(Optional.of(pendingReceipt));
        when(roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)).thenReturn(Optional.of(premiumRole));
        when(subscriptionRepository.findByUser(student)).thenReturn(Optional.empty());
        when(receiptRepository.save(any(PaymentReceipt.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentReceipt updated = paymentService.verifyReceipt(50L, verifyReq, "admin@mssid.dz");

        assertEquals(PaymentReceipt.ReceiptStatus.APPROVED, updated.getStatus());
        assertEquals(premiumRole, student.getRole());
        verify(userRepository).save(student);
        verify(receiptRepository).save(pendingReceipt);
        verify(adminAuditLogService).record(eq("admin@mssid.dz"), eq("RECEIPT_APPROVED"), eq("RECEIPT"), eq("50"), anyString());

        ArgumentCaptor<Subscription> subCaptor = ArgumentCaptor.forClass(Subscription.class);
        verify(subscriptionRepository).save(subCaptor.capture());
        Subscription saved = subCaptor.getValue();
        assertEquals(Subscription.SubscriptionStatus.ACTIVE, saved.getStatus());
        assertEquals(LocalDate.now(), saved.getStartDate());
        assertEquals(LocalDate.now().plusYears(1), saved.getEndDate());
    }

    @Test
    @DisplayName("verifyReceipt - Approval reuses an existing subscription row instead of duplicating it")
    void verifyReceipt_Approve_ReusesExistingSubscription() {
        PaymentReceipt pendingReceipt = PaymentReceipt.builder()
                .id(51L)
                .user(student)
                .status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION)
                .build();
        Subscription existing = Subscription.builder()
                .id(7L)
                .user(student)
                .status(Subscription.SubscriptionStatus.EXPIRED)
                .startDate(LocalDate.now().minusYears(2))
                .endDate(LocalDate.now().minusYears(1))
                .build();

        VerifyReceiptRequest verifyReq = new VerifyReceiptRequest();
        verifyReq.setApprove(true);

        when(receiptRepository.findForVerification(51L)).thenReturn(Optional.of(pendingReceipt));
        when(roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)).thenReturn(Optional.of(premiumRole));
        when(subscriptionRepository.findByUser(student)).thenReturn(Optional.of(existing));
        when(receiptRepository.save(any(PaymentReceipt.class))).thenAnswer(inv -> inv.getArgument(0));

        paymentService.verifyReceipt(51L, verifyReq, "admin@mssid.dz");

        ArgumentCaptor<Subscription> subCaptor = ArgumentCaptor.forClass(Subscription.class);
        verify(subscriptionRepository).save(subCaptor.capture());
        assertEquals(7L, subCaptor.getValue().getId());
        assertEquals(Subscription.SubscriptionStatus.ACTIVE, subCaptor.getValue().getStatus());
    }

    @Test
    @DisplayName("verifyReceipt - Rejection marks receipt as REJECTED with reason")
    void verifyReceipt_Reject_SetsReason() {
        PaymentReceipt pendingReceipt = PaymentReceipt.builder()
                .id(50L)
                .user(student)
                .status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION)
                .build();

        VerifyReceiptRequest verifyReq = new VerifyReceiptRequest();
        verifyReq.setApprove(false);
        verifyReq.setRejectionReason("Image illisible");

        when(receiptRepository.findForVerification(50L)).thenReturn(Optional.of(pendingReceipt));
        when(receiptRepository.save(any(PaymentReceipt.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentReceipt updated = paymentService.verifyReceipt(50L, verifyReq, "admin@mssid.dz");

        assertEquals(PaymentReceipt.ReceiptStatus.REJECTED, updated.getStatus());
        assertEquals("Image illisible", updated.getRejectionReason());
        verify(receiptRepository).save(pendingReceipt);
        verify(userRepository, never()).save(any());
        verify(subscriptionRepository, never()).save(any());
        verify(adminAuditLogService).record(eq("admin@mssid.dz"), eq("RECEIPT_REJECTED"), eq("RECEIPT"), eq("50"), anyString());
    }
    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.CsvSource({"P3M,3,900", "P12M,12,2400"})
    void chosenPlanStoresPriceAndActivatesCorrectDuration(String id, int months, double price) {
        when(userRepository.findByEmail(student.getEmail())).thenReturn(Optional.of(student));
        when(receiptRepository.save(any(PaymentReceipt.class))).thenAnswer(inv -> inv.getArgument(0));
        var uploaded = paymentService.submitReceipt(student.getEmail(), ReceiptUploadRequest.builder()
                .planId(id).amountDzd(price).receiptImageUrl("data:image/png;base64,test").build());
        assertEquals(price, uploaded.getAmountDzd());
        assertEquals(months, uploaded.getDurationMonths());
        assertEquals(id, uploaded.getPlanId());
        uploaded.setId(70L);
        when(receiptRepository.findForVerification(70L)).thenReturn(Optional.of(uploaded));
        when(roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)).thenReturn(Optional.of(premiumRole));
        when(subscriptionRepository.findByUser(student)).thenReturn(Optional.empty());
        var approve = new VerifyReceiptRequest(); approve.setApprove(true);
        paymentService.verifyReceipt(70L, approve, "admin@test.invalid");
        var captor = ArgumentCaptor.forClass(Subscription.class);
        verify(subscriptionRepository).save(captor.capture());
        assertEquals(LocalDate.now().plusMonths(months), captor.getValue().getEndDate());
        assertEquals(id, captor.getValue().getPlanId());
    }

    @Test void newPlanRejectsMissingOrWrongAmountAndUnknownIdentifier() {
        when(userRepository.findByEmail(student.getEmail())).thenReturn(Optional.of(student));
        assertThrows(IllegalArgumentException.class, () -> paymentService.submitReceipt(student.getEmail(), ReceiptUploadRequest.builder().planId("P12M").amountDzd(1500.0).build()));
        assertThrows(IllegalArgumentException.class, () -> paymentService.submitReceipt(student.getEmail(), ReceiptUploadRequest.builder().planId("P3M").build()));
        assertThrows(IllegalArgumentException.class, () -> paymentService.submitReceipt(student.getEmail(), ReceiptUploadRequest.builder().planId("P99M").amountDzd(900.0).build()));
        verify(receiptRepository, never()).save(any());
    }

    @Test void approvingReceiptTwiceCannotExtendSubscriptionTwice() {
        var receipt = PaymentReceipt.builder().id(71L).user(student).status(PaymentReceipt.ReceiptStatus.APPROVED).build();
        when(receiptRepository.findForVerification(71L)).thenReturn(Optional.of(receipt));
        var approve = new VerifyReceiptRequest(); approve.setApprove(true);
        assertThrows(IllegalArgumentException.class, () -> paymentService.verifyReceipt(71L, approve, "admin@test.invalid"));
        verifyNoInteractions(subscriptionRepository);
    }

    @Test void earlyRenewalPreservesPaidDaysAndOriginalStart() {
        var receipt = PaymentReceipt.builder().id(72L).user(student).durationMonths(3).planId("P3M")
                .status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION).build();
        var start = LocalDate.now().minusMonths(2); var end = LocalDate.now().plusMonths(4);
        var existing = Subscription.builder().id(9L).user(student).status(Subscription.SubscriptionStatus.ACTIVE).startDate(start).endDate(end).build();
        when(receiptRepository.findForVerification(72L)).thenReturn(Optional.of(receipt));
        when(roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)).thenReturn(Optional.of(premiumRole));
        when(subscriptionRepository.findByUser(student)).thenReturn(Optional.of(existing));
        var approve = new VerifyReceiptRequest(); approve.setApprove(true);
        paymentService.verifyReceipt(72L, approve, "admin@test.invalid");
        assertEquals(start, existing.getStartDate()); assertEquals(end.plusMonths(3), existing.getEndDate());
    }

    @Test void approvesAnAlreadyFiledSixMonthReceiptWithoutSellingItAgain() {
        var old = PaymentReceipt.builder().id(71L).user(student).planId("P6M").durationMonths(6).amountDzd(1500.0).status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION).build();
        when(receiptRepository.findForVerification(71L)).thenReturn(Optional.of(old));
        when(roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)).thenReturn(Optional.of(premiumRole));
        when(subscriptionRepository.findByUser(student)).thenReturn(Optional.empty());
        var request = new VerifyReceiptRequest(); request.setApprove(true);
        paymentService.verifyReceipt(71L, request, "admin@test.invalid");
        var saved = ArgumentCaptor.forClass(Subscription.class); verify(subscriptionRepository).save(saved.capture());
        assertEquals(LocalDate.now().plusMonths(6), saved.getValue().getEndDate());
        assertEquals("P6M", saved.getValue().getPlanId());
    }
}
