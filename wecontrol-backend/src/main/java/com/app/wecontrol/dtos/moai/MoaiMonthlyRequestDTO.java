package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.bid.BidRequestDTO;
import com.app.wecontrol.dtos.bid.BidResponseDTO;
import com.app.wecontrol.dtos.pay.PayRequestDTO;
import com.app.wecontrol.dtos.pay.PayResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoaiMonthlyRequestDTO {
    private String month;
    private String bidStartDate;
    private String bidEndDate;
    private String status;
    private List<BidRequestDTO> bids;
    private List<PayRequestDTO> pays;
}
