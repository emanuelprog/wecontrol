package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.user.UserRequestDTO;
import com.app.wecontrol.dtos.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoaiRequestDTO {
    private String name;
    private Integer value;
    private Integer year;
    private String rules;
    private String status;
    private UserRequestDTO organizer;
    private List<UserRequestDTO> participants;
    private List<MoaiMonthlyRequestDTO> monthly;
}
