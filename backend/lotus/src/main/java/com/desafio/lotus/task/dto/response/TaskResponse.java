package com.desafio.lotus.task.dto.response;

import com.desafio.lotus.task.model.TaskPriority;
import com.desafio.lotus.task.model.TaskStatus;
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

