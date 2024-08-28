package com.app.wecontrol.dtos.login;

import com.app.wecontrol.models.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private String id;
    private String login;
    private String email;
    private String name;
    private String role;
    private String cellphone;

    public static LoginResponseDTO fromUserAndAccessTokenAndRefreshToken(User user, String accessToken, String refreshToken) {
        return new LoginResponseDTO(
                accessToken,
                refreshToken,
                user.getId(),
                user.getLogin(),
                user.getEmail(),
                user.getName(),
                user.getUserRole().getRole(),
                user.getCellphone()
        );
    }
}
