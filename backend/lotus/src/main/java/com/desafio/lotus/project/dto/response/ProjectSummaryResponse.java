package com.desafio.lotus.project.dto.response;

public record ProjectSummaryResponse(
        long total,
        long pending,
        long inProgress,
        long done
) {
}
