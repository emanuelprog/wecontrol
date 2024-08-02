package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.bid.BidResponseDTO;

import java.util.List;

public record MoaiMonthlyResponseDTO(String id, String idMoai, String month, String bidStartDate, String bidEndDate, List<BidResponseDTO> bids, String status) {
}
