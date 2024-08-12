package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.bid.BidResponseDTO;
import com.app.wecontrol.dtos.pay.PayResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoaiMonthlyResponseDTO {
    private String month;
    private String bidStartDate;
    private String bidEndDate;
    private String status;
    private List<BidResponseDTO> bids;
    private List<PayResponseDTO> pays;

    public static MoaiMonthlyResponseDTO moaiMonthlyResponseDTOfromMoaiMonthlyRequestDTO(MoaiMonthlyRequestDTO moaiMonthlyRequestDTO) {

        List<BidResponseDTO> bids = moaiMonthlyRequestDTO.getBids().stream()
                .map(BidResponseDTO::bidResponseDTOfromBidRequestDTO)
                .collect(Collectors.toList());

        List<PayResponseDTO> pays = moaiMonthlyRequestDTO.getPays().stream()
                .map(PayResponseDTO::payResponseDTOfromPayRequestDTO)
                .collect(Collectors.toList());

        return new MoaiMonthlyResponseDTO(
                moaiMonthlyRequestDTO.getMonth(),
                moaiMonthlyRequestDTO.getBidStartDate(),
                moaiMonthlyRequestDTO.getBidEndDate(),
                moaiMonthlyRequestDTO.getStatus(),
                bids,
                pays
        );
    }
}
