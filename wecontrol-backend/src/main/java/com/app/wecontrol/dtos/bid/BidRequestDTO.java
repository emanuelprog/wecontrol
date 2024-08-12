package com.app.wecontrol.dtos.bid;

import com.app.wecontrol.dtos.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidRequestDTO {
    private UserResponseDTO user;
    private Integer valueBid;
}
