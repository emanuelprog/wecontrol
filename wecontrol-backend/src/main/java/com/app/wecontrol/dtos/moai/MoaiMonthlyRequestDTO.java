package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.bid.BidResponseDTO;
import com.app.wecontrol.dtos.pay.PayResponseDTO;

import java.util.List;

public record MoaiMonthlyRequestDTO(
        String month,
        String bidStartDate,
        String bidEndDate,
        String status,
        List<BidResponseDTO> bids,
        List<PayResponseDTO> pays) {
}
