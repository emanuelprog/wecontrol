package com.app.wecontrol.models.moai;

import com.app.wecontrol.dtos.bid.BidResponseDTO;
import com.app.wecontrol.dtos.moai.MoaiMonthlyRequestDTO;
import com.app.wecontrol.dtos.moai.MoaiMonthlyResponseDTO;
import com.app.wecontrol.dtos.moai.MoaiRequestDTO;
import com.app.wecontrol.dtos.pay.PayResponseDTO;
import com.app.wecontrol.dtos.user.UserRequestDTO;
import com.app.wecontrol.dtos.user.UserResponseDTO;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Document(collection = "moais")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Moai {
    @Id
    private String id;
    private String name;
    private Integer value;
    private Integer year;
    private String rules;
    private String status;
    private UserResponseDTO organizer;

    private List<UserResponseDTO> participants;

    private List<MoaiMonthlyResponseDTO> monthly;

    @CreatedDate
    private LocalDateTime createdAt;

    public Moai(String name, Integer value, Integer year, String rules, String status, UserResponseDTO organizer, List<UserResponseDTO> participants, List<MoaiMonthlyResponseDTO> monthly, LocalDateTime createdAt) {
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

    public static Moai createMoaiFromRequest(MoaiRequestDTO moaiRequestDTO) {
        UserResponseDTO organizer = UserResponseDTO.userResponseDTOfromUserRequestDTO(moaiRequestDTO.getOrganizer());

        List<UserResponseDTO> participants = Optional.ofNullable(moaiRequestDTO.getParticipants())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(UserResponseDTO::userResponseDTOfromUserRequestDTO)
                .collect(Collectors.toList());

        List<MoaiMonthlyResponseDTO> monthly = Optional.ofNullable(moaiRequestDTO.getMonthly())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(MoaiMonthlyResponseDTO::moaiMonthlyResponseDTOfromMoaiMonthlyRequestDTO)
                .collect(Collectors.toList());

        return new Moai(
                moaiRequestDTO.getName(),
                moaiRequestDTO.getValue(),
                moaiRequestDTO.getYear(),
                moaiRequestDTO.getRules(),
                moaiRequestDTO.getStatus(),
                organizer,
                participants,
                monthly,
                LocalDateTime.now().minusHours(4)
        );
    }

    public static Moai createMoaiFromRequestAndParams(String id, MoaiRequestDTO moaiRequestDTO, List<MoaiMonthlyResponseDTO> moaiMonthlyResponseDTOList, LocalDateTime createdAt) {
        UserResponseDTO organizer = UserResponseDTO.userResponseDTOfromUserRequestDTO(moaiRequestDTO.getOrganizer());

        List<UserResponseDTO> participants = Optional.ofNullable(moaiRequestDTO.getParticipants())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(UserResponseDTO::userResponseDTOfromUserRequestDTO)
                .collect(Collectors.toList());

        return new Moai(
                id,
                moaiRequestDTO.getName(),
                moaiRequestDTO.getValue(),
                moaiRequestDTO.getYear(),
                moaiRequestDTO.getRules(),
                moaiRequestDTO.getStatus(),
                organizer,
                participants,
                moaiMonthlyResponseDTOList,
                createdAt
        );
    }
}
