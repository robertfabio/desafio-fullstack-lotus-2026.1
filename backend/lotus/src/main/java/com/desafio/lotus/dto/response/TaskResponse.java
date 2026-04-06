package com.desafio.lotus.dto.response;

import com.desafio.lotus.model.TaskPriority;
import com.desafio.lotus.model.TaskStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record TaskResponse(
        UUID id,
        UUID projectId,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDateTime dueDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
