package com.desafio.lotus.user.dto.response;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
