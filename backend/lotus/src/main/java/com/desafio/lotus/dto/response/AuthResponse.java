package com.desafio.lotus.dto.response;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
