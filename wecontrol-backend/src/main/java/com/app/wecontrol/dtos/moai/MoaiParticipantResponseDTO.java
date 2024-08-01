package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.login.LoginResponseDTO;

public record MoaiParticipantResponseDTO(String id, LoginResponseDTO participant, String idMoai) {
}
