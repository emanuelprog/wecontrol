package com.app.wecontrol.dtos.moai;

import java.util.Date;
import java.util.List;

public record MoaiMonthlyResponseDTO(String id, String idMoai, String month, String bidStartDate, String bidEndDate, List<BidDTO> bids, String status) {
}
