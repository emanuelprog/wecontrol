package com.app.wecontrol.dtos.register;

import com.app.wecontrol.dtos.user.UserRole;

public record RegisterDTO(String login, String password, UserRole role) {
}
