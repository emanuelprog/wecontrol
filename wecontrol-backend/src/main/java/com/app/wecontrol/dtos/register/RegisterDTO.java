package com.app.wecontrol.dtos.register;

import com.app.wecontrol.models.user.UserRole;

public record RegisterDTO(String login, String password, UserRole role, String name, String email) {
}
