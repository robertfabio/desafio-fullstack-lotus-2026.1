package com.desafio.lotus.user.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.desafio.lotus.user.dto.response.AuthResponse;
import com.desafio.lotus.user.dto.response.UserResponse;
import com.desafio.lotus.user.service.AuthService;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    void registerShouldReturnBadRequestForInvalidPayload() throws Exception {
        String payload = """
                {
                  "name": "",
                  "email": "invalid",
                  "password": "123"
                }
                """;

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Falha na validação"))
                .andExpect(jsonPath("$.errors").isArray());
    }

    @Test
    void loginShouldReturnOkWithServiceResponse() throws Exception {
        UserResponse user = new UserResponse(
                UUID.randomUUID(),
                "Alice",
                "alice@mail.com",
                LocalDateTime.now()
        );

        when(authService.login(any())).thenReturn(new AuthResponse("jwt-token", user));

        String payload = """
                {
                  "email": "alice@mail.com",
                  "password": "123456"
                }
                """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.email").value("alice@mail.com"));
    }
}
