package com.app.wecontrol.service.moai;

import com.app.wecontrol.dtos.moai.*;
import com.app.wecontrol.dtos.user.User;
import com.app.wecontrol.exception.BadRequestException;
import com.app.wecontrol.exception.NotFoundException;
import com.app.wecontrol.repository.moai.MoaiParticipantRepository;
import com.app.wecontrol.repository.moai.MoaiRepository;
import com.app.wecontrol.repository.user.UserRepository;
import com.app.wecontrol.utils.MoaiUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoaiService {

    private final MoaiRepository moaiRepository;
    private final UserRepository userRepository;
    private final MoaiUtils moaiUtils;
    private final MoaiMonthlyService moaiMonthlyService;
    private final MoaiParticipantRepository moaiParticipantRepository;

    public List<MoaiResponseDTO> getMoais(String id) {
        User actualUser = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not exists!"));

        List<Moai> moais = getMoaisByUserRole(id, actualUser.getUserRole().getRole());

        if (moais.isEmpty()) {
            return new ArrayList<>();
        }

        return moais.stream()
                .map(moai -> new MoaiResponseDTO(
                        moai.getId(),
                        moai.getName(),
                        moai.getValue(),
                        moai.getYear(),
                        moai.getRules(),
                        moai.getDuration(),
                        moai.getStatus(),
                        moai.getOrganizer().id(),
                        moai.getOrganizer().name(),
                        moaiUtils.formatterLocalDateToString(moai.getCreatedAt()),
                        getParticipantsByIdMoai(moai.getId())
                ))
                .collect(Collectors.toList());
    }

    public MoaiResponseDTO save(MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findByNameAndValueAndYear(moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year());

        if (moaiDB.isPresent()) {
            throw new BadRequestException("Moai already exists!");
        }

        try {
            Moai moai = moaiRepository.save(new Moai(moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year(), moaiRequestDTO.rules(), moaiRequestDTO.duration(), moaiRequestDTO.status(), moaiRequestDTO.organizer(), LocalDateTime.now().minusHours(4)));

            moaiMonthlyService.save(moai);

            return new MoaiResponseDTO(moai.getId(), moai.getName(), moai.getValue(), moai.getYear(), moai.getRules(), moai.getDuration(), moai.getStatus(), moai.getOrganizer().id(), moai.getOrganizer().name(), new MoaiUtils().formatterLocalDateToString(moai.getCreatedAt()), null);
        } catch (Exception e) {
            throw new BadRequestException("Unable to save the moai");
        }
    }

    public MoaiResponseDTO update(String id, MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findById(id);

        if (moaiDB.isPresent()) {
            Moai existingMoai = moaiDB.get();
            Moai updatedMoai = moaiRepository.save(new Moai(id, moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year(), moaiRequestDTO.rules(), moaiRequestDTO.duration(), moaiRequestDTO.status(), moaiRequestDTO.organizer(), existingMoai.getCreatedAt()));

            moaiMonthlyService.update(updatedMoai, moaiUtils.extractMonths(existingMoai.getDuration()), moaiUtils.extractMonths(moaiRequestDTO.duration()));

            return new MoaiResponseDTO(updatedMoai.getId(), updatedMoai.getName(), updatedMoai.getValue(), updatedMoai.getYear(), updatedMoai.getRules(), updatedMoai.getDuration(), updatedMoai.getStatus(), updatedMoai.getOrganizer().id(), updatedMoai.getOrganizer().name(), new MoaiUtils().formatterLocalDateToString(updatedMoai.getCreatedAt()), null);
        } else {
            throw new NotFoundException("Moai not found!");
        }
    }

    public Object delete(String id) {
        // Fazer validação se existe participantes (Se existir não permitir exclusão).

        moaiRepository.deleteById(id);
        return null;
    }

    private List<Moai> getMoaisByUserRole(String id, String userRole) {
        return "admin".equalsIgnoreCase(userRole) ? moaiRepository.findAllByOrganizerId(id) : moaiRepository.findAll();
    }

    private List<MoaiParticipantResponseDTO> getParticipantsByIdMoai(String idMoai) {
        List<MoaiParticipant> participants = moaiParticipantRepository.findAllByIdMoai(idMoai);
        return participants.stream()
                .map(participant -> new MoaiParticipantResponseDTO(
                        participant.getId(),
                        participant.getParticipant(),
                        participant.getIdMoai()
                ))
                .collect(Collectors.toList());
    }

    public void updateStatuses() {
        List<Moai> moais = moaiRepository.findAll();

        for (Moai moai : moais) {
            int durationInMonths = moaiUtils.extractMonths(moai.getDuration());
            LocalDateTime creationDate = moai.getCreatedAt();
            LocalDateTime expirationDate = creationDate.plusMonths(durationInMonths);

            if (LocalDateTime.now().isAfter(expirationDate)) {
                moai.setStatus("Expired");
                moaiRepository.save(moai);
            }
        }
    }
}
