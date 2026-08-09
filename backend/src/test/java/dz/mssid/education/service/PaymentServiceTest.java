package dz.mssid.education.service;

import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.PaymentReceiptRepository;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentReceiptRepository receiptRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

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
    }

    @Test
    @DisplayName("submitReceipt - Saves new payment receipt successfully")
    void submitReceipt_Success() {
        ReceiptUploadRequest request = ReceiptUploadRequest.builder()
                .userEmail("yassine@mssid.dz")
                .paymentMethod("BARIDIMOB")
                .transactionRef("BM-12345")
                .amountDzd(1500.0)
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
    }

    @Test
    @DisplayName("verifyReceipt - Approval promotes student to ROLE_PREMIUM")
    void verifyReceipt_Approve_PromotesUserToPremium() {
        PaymentReceipt pendingReceipt = PaymentReceipt.builder()
                .id(50L)
                .user(student)
                .status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION)
                .build();

        VerifyReceiptRequest verifyReq = new VerifyReceiptRequest();
        verifyReq.setApprove(true);

        when(receiptRepository.findById(50L)).thenReturn(Optional.of(pendingReceipt));
        when(roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)).thenReturn(Optional.of(premiumRole));
        when(receiptRepository.save(any(PaymentReceipt.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentReceipt updated = paymentService.verifyReceipt(50L, verifyReq);

        assertEquals(PaymentReceipt.ReceiptStatus.APPROVED, updated.getStatus());
        assertEquals(premiumRole, student.getRole());
        verify(userRepository).save(student);
        verify(receiptRepository).save(pendingReceipt);
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

        when(receiptRepository.findById(50L)).thenReturn(Optional.of(pendingReceipt));
        when(receiptRepository.save(any(PaymentReceipt.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentReceipt updated = paymentService.verifyReceipt(50L, verifyReq);

        assertEquals(PaymentReceipt.ReceiptStatus.REJECTED, updated.getStatus());
        assertEquals("Image illisible", updated.getRejectionReason());
        verify(receiptRepository).save(pendingReceipt);
        verify(userRepository, never()).save(any());
    }
}
