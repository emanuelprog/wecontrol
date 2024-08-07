package com.app.wecontrol.dtos.login;

public record LoginResponseDTO(
        String accessToken,
        String refreshToken,
        String id,
        String login,
        String email,
        String name,
        String role,
        String cellphone
) {
}
