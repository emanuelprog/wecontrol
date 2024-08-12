package com.app.wecontrol.dtos.pay;

import com.app.wecontrol.dtos.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayRequestDTO {
    private UserResponseDTO user;
    private Integer valuePay;
}
