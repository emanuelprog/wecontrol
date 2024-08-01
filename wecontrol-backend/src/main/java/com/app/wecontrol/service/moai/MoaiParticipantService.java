package com.app.wecontrol.service.moai;

import com.app.wecontrol.dtos.moai.Moai;
import com.app.wecontrol.dtos.moai.MoaiMonthly;
import com.app.wecontrol.dtos.moai.MoaiParticipant;
import com.app.wecontrol.dtos.moai.MoaiParticipantRequestDTO;
import com.app.wecontrol.repository.moai.MoaiParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MoaiParticipantService {

    private final MoaiParticipantRepository moaiParticipantRepository;
    public MoaiParticipant save(MoaiParticipantRequestDTO moaiParticipantRequestDTO) {
        MoaiParticipant participant = new MoaiParticipant(moaiParticipantRequestDTO.participant(), moaiParticipantRequestDTO.idMoai());
        return moaiParticipantRepository.save(participant);
    }
}
