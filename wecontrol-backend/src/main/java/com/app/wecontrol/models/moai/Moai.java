package com.app.wecontrol.models.moai;

import com.app.wecontrol.dtos.moai.MoaiMonthlyResponseDTO;
import com.app.wecontrol.dtos.user.UserResponseDTO;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "moais")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Moai {
    @Id
    private String id;
    private String name;
    private String value;
    private String year;
    private String rules;
    private String status;
    private UserResponseDTO organizer;

    private List<UserResponseDTO> participants;

    private List<MoaiMonthlyResponseDTO> monthly;

    @CreatedDate
    private LocalDateTime createdAt;

    public Moai(String name, String value, String year, String rules, String status, UserResponseDTO organizer, List<UserResponseDTO> participants, List<MoaiMonthlyResponseDTO> monthly, LocalDateTime createdAt) {
        this.name = name;
        this.value = value;
        this.year = year;
        this.rules = rules;
        this.status = status;
        this.organizer = organizer;
        this.participants = participants;
        this.monthly = monthly;
        this.createdAt = createdAt;
    }
}
