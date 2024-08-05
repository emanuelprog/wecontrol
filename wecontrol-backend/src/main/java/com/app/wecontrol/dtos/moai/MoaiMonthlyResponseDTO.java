package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.bid.BidResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

public record MoaiMonthlyResponseDTO(String month, String bidStartDateStr, String bidEndDateStr, LocalDateTime bidStartDate, LocalDateTime bidEndDate, String status, List<BidResponseDTO> bids) {
}
