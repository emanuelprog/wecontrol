package com.app.wecontrol.dtos.moai;

import java.time.LocalDateTime;
import java.util.Date;

public record MoaiResponseDTO(String id, String name, String value, String year, String rules, String duration, String status, String userId, String userName, String createdAt, Date bidStartDate, Date bidEndDate) {
}
