package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.login.LoginResponseDTO;

import java.util.Date;
import java.util.List;

public record MoaiRequestDTO(String name, String value, String year, String rules, String duration, String status, LoginResponseDTO organizer, List<MoaiParticipantResponseDTO> participants) {
}
