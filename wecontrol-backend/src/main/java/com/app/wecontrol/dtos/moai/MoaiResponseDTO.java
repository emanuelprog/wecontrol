package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.user.UserResponseDTO;

import java.util.List;

public record MoaiResponseDTO(
        String id,
        String name,
        String value,
        String year,
        String rules,
        String status,
        UserResponseDTO organizer,
        List<UserResponseDTO> participants,
        List<MoaiMonthlyResponseDTO> monthly,
        String createdAt) {
}
