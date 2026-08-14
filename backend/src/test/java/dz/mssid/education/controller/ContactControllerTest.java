package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.ContactMessageRequest;
import dz.mssid.education.entity.ContactMessage;
import dz.mssid.education.service.ContactService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ContactControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ContactService contactService;

    @InjectMocks
    private ContactController contactController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(contactController).build();
    }

    @Test
    @DisplayName("POST /api/v1/contact - Accepts a well-formed message")
    void submitContact_Success() throws Exception {
        ContactMessageRequest request = new ContactMessageRequest();
        request.setName("Yassine");
        request.setEmail("yassine@mssid.dz");
        request.setType("suggestion");
        request.setMessage("فكرة رائعة لتحسين واجهة الألعاب");

        when(contactService.submit(any(ContactMessageRequest.class))).thenReturn(new ContactMessage());

        mockMvc.perform(post("/api/v1/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("POST /api/v1/contact - Rejects a message missing required fields")
    void submitContact_MissingFields_BadRequest() throws Exception {
        ContactMessageRequest request = new ContactMessageRequest();
        request.setName("");
        request.setEmail("yassine@mssid.dz");
        request.setMessage("");

        mockMvc.perform(post("/api/v1/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
