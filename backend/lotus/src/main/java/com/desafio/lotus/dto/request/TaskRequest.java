package com.desafio.lotus.dto.request;

import com.desafio.lotus.model.TaskPriority;
import com.desafio.lotus.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

public record TaskRequest(
        @NotBlank(message = "Título é obrigatório")
        @Size(min = 2, max = 255, message = "Título deve ter entre 2 e 255 caracteres")
        String title,

        @Size(max = 5000, message = "Descrição deve ter no máximo 5000 caracteres")
        String description,

        @NotNull(message = "Status é obrigatório")
        TaskStatus status,

        @NotNull(message = "Prioridade é obrigatória")
        TaskPriority priority,

        LocalDateTime dueDate,

        @NotNull(message = "Projeto é obrigatório")
        UUID projectId
) {
}
