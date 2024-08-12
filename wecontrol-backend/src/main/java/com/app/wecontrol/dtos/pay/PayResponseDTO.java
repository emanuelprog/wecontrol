package com.app.wecontrol.dtos.pay;

import com.app.wecontrol.dtos.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayResponseDTO {
    private UserResponseDTO user;
    private Integer valuePay;

    public static PayResponseDTO payResponseDTOfromPayRequestDTO(PayRequestDTO payRequestDTO) {
        return new PayResponseDTO(
                payRequestDTO.getUser(),
                payRequestDTO.getValuePay()
        );
    }
}
