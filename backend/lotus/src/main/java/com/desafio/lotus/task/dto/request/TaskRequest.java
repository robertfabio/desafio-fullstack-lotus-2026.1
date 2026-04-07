package com.desafio.lotus.task.dto.request;

import com.desafio.lotus.task.model.TaskPriority;
import com.desafio.lotus.task.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

public record TaskRequest(
        @NotBlank(message = "Titulo e obrigatorio")
        @Size(min = 2, max = 255, message = "Titulo deve ter entre 2 e 255 caracteres")
        String title,

        @Size(max = 5000, message = "Descricao deve ter no maximo 5000 caracteres")
        String description,

        @NotNull(message = "Status e obrigatorio")
        TaskStatus status,

        @NotNull(message = "Prioridade e obrigatoria")
        TaskPriority priority,

        LocalDateTime dueDate,

        @NotNull(message = "Projeto e obrigatorio")
        UUID projectId
) {
}

