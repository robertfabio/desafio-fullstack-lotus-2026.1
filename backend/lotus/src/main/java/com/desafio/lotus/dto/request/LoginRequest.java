package com.desafio.lotus.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email precisa ser válido")
        String email,

        @NotBlank(message = "Senha é obrigatório")
        String password
) {
}
