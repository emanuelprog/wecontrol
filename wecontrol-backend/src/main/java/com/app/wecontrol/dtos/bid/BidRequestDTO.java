package com.app.wecontrol.dtos.bid;

import com.app.wecontrol.dtos.user.UserResponseDTO;

public record BidRequestDTO(String idMonthly, UserResponseDTO user, String valueBid) {
}
