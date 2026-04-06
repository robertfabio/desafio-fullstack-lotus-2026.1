package com.desafio.lotus.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        UUID userId,
        String name,
        String description,
        Boolean shared,
        LocalDateTime deadline,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
