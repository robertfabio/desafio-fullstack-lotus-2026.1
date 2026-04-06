package com.desafio.lotus.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 255, message = "Nome precisa ser maior que 2 caracteres")
        String name,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email precisa ser válido")
        String email
) {
}
