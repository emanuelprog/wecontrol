package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.user.UserResponseDTO;

public record MoaiParticipantRequestDTO(UserResponseDTO participant, String idMoai) {
}
