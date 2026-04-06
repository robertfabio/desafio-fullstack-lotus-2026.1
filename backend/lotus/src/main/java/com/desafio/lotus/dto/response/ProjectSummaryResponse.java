package com.desafio.lotus.dto.response;

public record ProjectSummaryResponse(
        long total,
        long pending,
        long inProgress,
        long done
) {
}
