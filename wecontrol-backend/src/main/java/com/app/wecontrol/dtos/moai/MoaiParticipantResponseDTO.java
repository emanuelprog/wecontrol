package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.user.UserResponseDTO;

public record MoaiParticipantResponseDTO(String id, UserResponseDTO participant, String idMoai) {
}
