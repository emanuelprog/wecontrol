package com.app.wecontrol.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private String id;
    private String email;
    private String name;
    private String cellphone;

    public static UserResponseDTO userResponseDTOfromUserRequestDTO(UserRequestDTO userRequestDTO) {
        return new UserResponseDTO(
                userRequestDTO.getId(),
                userRequestDTO.getEmail(),
                userRequestDTO.getName(),
                userRequestDTO.getCellphone()
        );
    }
}
