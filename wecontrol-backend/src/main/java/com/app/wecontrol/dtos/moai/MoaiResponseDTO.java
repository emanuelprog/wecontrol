package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.bid.BidResponseDTO;
import com.app.wecontrol.dtos.user.UserResponseDTO;
import com.app.wecontrol.models.moai.Moai;
import com.app.wecontrol.utils.MoaiUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoaiResponseDTO {
    private String id;
    private String name;
    private Integer value;
    private Integer year;
    private String rules;
    private String status;
    private UserResponseDTO organizer;
    private List<UserResponseDTO> participants;
    private List<MoaiMonthlyResponseDTO> monthly;
    private String createdAt;

    public static MoaiResponseDTO moaiResponseDTOfromMoai(Moai moai) {
        moai.getMonthly().forEach(m ->
                m.setBids(m.getBids().stream()
                        .sorted(Comparator.comparing(BidResponseDTO::getValueBid).reversed())
                        .collect(Collectors.toList())
                )
        );
        List<MoaiMonthlyResponseDTO> sortedMonthlyList = moai.getMonthly();

        return new MoaiResponseDTO(
                moai.getId(),
                moai.getName(),
                moai.getValue(),
                moai.getYear(),
                moai.getRules(),
                moai.getStatus(),
                moai.getOrganizer(),
                moai.getParticipants(),
                sortedMonthlyList,
                new MoaiUtils().formatterLocalDateToString(moai.getCreatedAt())
        );
    }
}
