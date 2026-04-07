package com.desafio.lotus.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record ProjectRequest(
        @NotBlank(message = "Nome do projeto é obrigatório")
        @Size(min = 2, max = 255, message = "Nome do projeto deve ter entre 2 e 255 caracteres")
        String name,

        @Size(max = 5000, message = "Descrição deve ter no máximo 5000 caracteres")
        String description,

        LocalDateTime deadline,

        Boolean shared
) {
}
