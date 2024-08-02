package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.user.UserResponseDTO;

import java.util.List;

public record MoaiRequestDTO(String name, String value, String year, String rules, String duration, String status, UserResponseDTO organizer, List<MoaiParticipantResponseDTO> participants) {
}
