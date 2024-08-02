package com.app.wecontrol.dtos.bid;

import com.app.wecontrol.dtos.user.UserResponseDTO;

public record BidResponseDTO(String id, UserResponseDTO user, String valueBid) {
}
