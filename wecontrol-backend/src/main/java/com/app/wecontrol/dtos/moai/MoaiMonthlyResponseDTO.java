package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.bid.BidResponseDTO;

import java.util.List;

public record MoaiMonthlyResponseDTO(String month, String bidStartDate, String bidEndDate, String status, List<BidResponseDTO> bids) {
}
