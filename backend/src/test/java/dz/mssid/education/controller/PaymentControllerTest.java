package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.User;
import dz.mssid.education.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController).build();
    }

    @Test
    @DisplayName("POST /api/v1/payments/receipt/upload - Submits payment receipt successfully")
    void submitReceipt_Success() throws Exception {
        ReceiptUploadRequest uploadRequest = ReceiptUploadRequest.builder()
                .userEmail("student@mssid.dz")
                .paymentMethod("BARIDIMOB")
                .transactionRef("BM-99887766")
                .amountDzd(1500.0)
                .receiptImageUrl("https://mssid.dz/receipt.png")
                .build();

        User user = User.builder().id(2L).email("student@mssid.dz").build();
        PaymentReceipt receipt = PaymentReceipt.builder()
                .id(10L)
                .user(user)
                .paymentMethod("BARIDIMOB")
                .transactionRef("BM-99887766")
                .amountDzd(1500.0)
                .status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION)
                .submittedAt(LocalDateTime.now())
                .build();

        when(paymentService.submitReceipt(eq("student@mssid.dz"), any(ReceiptUploadRequest.class))).thenReturn(receipt);

        mockMvc.perform(post("/api/v1/payments/receipt/upload")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(uploadRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.transactionRef").value("BM-99887766"))
                .andExpect(jsonPath("$.status").value("PENDING_VERIFICATION"));
    }

    @Test
    @DisplayName("GET /api/v1/payments/admin/receipts - Returns all submitted payment receipts")
    void getAllReceipts_Success() throws Exception {
        PaymentReceipt r1 = PaymentReceipt.builder().id(1L).status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION).build();
        PaymentReceipt r2 = PaymentReceipt.builder().id(2L).status(PaymentReceipt.ReceiptStatus.APPROVED).build();

        when(paymentService.getAllReceipts()).thenReturn(List.of(r1, r2));

        mockMvc.perform(get("/api/v1/payments/admin/receipts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].status").value("PENDING_VERIFICATION"))
                .andExpect(jsonPath("$[1].status").value("APPROVED"));
    }

    @Test
    @DisplayName("PUT /api/v1/payments/admin/receipts/{id}/verify - Approves receipt and promotes user")
    void verifyReceipt_Approve_Success() throws Exception {
        VerifyReceiptRequest verifyReq = new VerifyReceiptRequest();
        verifyReq.setApprove(true);

        PaymentReceipt approvedReceipt = PaymentReceipt.builder()
                .id(10L)
                .status(PaymentReceipt.ReceiptStatus.APPROVED)
                .verifiedAt(LocalDateTime.now())
                .build();

        when(paymentService.verifyReceipt(eq(10L), any(VerifyReceiptRequest.class))).thenReturn(approvedReceipt);

        mockMvc.perform(put("/api/v1/payments/admin/receipts/10/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }
}
