package com.app.wecontrol.dtos.bid;

import com.app.wecontrol.dtos.user.UserResponseDTO;

public record BidResponseDTO(UserResponseDTO user, Integer valueBid) {
}
