package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.login.LoginResponseDTO;

public record BidDTO(LoginResponseDTO user, Integer valueBid) {
}
