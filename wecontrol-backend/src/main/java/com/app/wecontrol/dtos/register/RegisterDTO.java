package com.app.wecontrol.dtos.register;

import com.app.wecontrol.models.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {
    private String login;
    private String password;
    private UserRole role;
    private String name;
    private String email;
    private String cellphone;
}
