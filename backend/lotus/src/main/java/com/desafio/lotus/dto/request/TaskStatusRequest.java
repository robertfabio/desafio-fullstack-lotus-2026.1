package com.desafio.lotus.dto.request;

import com.desafio.lotus.model.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record TaskStatusRequest(
        @NotNull(message = "Status é obrigatório")
        TaskStatus status
) {
}
