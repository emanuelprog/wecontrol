package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.login.LoginResponseDTO;

public record MoaiParticipantRequestDTO(LoginResponseDTO participant, String idMoai) {
}
