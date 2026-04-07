package com.desafio.lotus.task.dto.request;

import com.desafio.lotus.task.model.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record TaskStatusRequest(
        @NotNull(message = "Status e obrigatorio")
        TaskStatus status
) {
}

