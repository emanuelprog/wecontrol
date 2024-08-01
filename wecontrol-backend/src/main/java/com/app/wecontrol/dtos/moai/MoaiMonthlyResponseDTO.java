package com.app.wecontrol.dtos.moai;

import java.util.Date;

public record MoaiMonthlyResponseDTO(String id, String idMoai, String month, String bidStartDate, String bidEndDate, String highestBid, String idHighestBidderUser, String status) {
}
