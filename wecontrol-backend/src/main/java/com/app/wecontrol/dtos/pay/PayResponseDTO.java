package com.app.wecontrol.dtos.pay;

import com.app.wecontrol.dtos.user.UserResponseDTO;

public record PayResponseDTO(UserResponseDTO user, Integer valuePay) {
}
