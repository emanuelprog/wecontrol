package com.app.wecontrol.dtos.bid;

import com.app.wecontrol.dtos.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidResponseDTO {
    private UserResponseDTO user;
    private Integer valueBid;

    public static BidResponseDTO bidResponseDTOfromBidRequestDTO(BidRequestDTO bidRequestDTO) {
        return new BidResponseDTO(
                bidRequestDTO.getUser(),
                bidRequestDTO.getValueBid()
        );
    }
}
