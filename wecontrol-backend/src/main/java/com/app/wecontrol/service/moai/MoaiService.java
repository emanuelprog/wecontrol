package com.app.wecontrol.service.moai;

import com.app.wecontrol.dtos.moai.Moai;
import com.app.wecontrol.dtos.moai.MoaiRequestDTO;
import com.app.wecontrol.dtos.moai.MoaiResponseDTO;
import com.app.wecontrol.dtos.user.User;
import com.app.wecontrol.exception.BadRequestException;
import com.app.wecontrol.exception.NotFoundException;
import com.app.wecontrol.repository.moai.MoaiRepository;
import com.app.wecontrol.repository.user.UserRepository;
import com.app.wecontrol.utils.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoaiService {

    private final MoaiRepository moaiRepository;
    private final UserRepository userRepository;

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
                        new DateUtils().formatterLocalDateToString(moai.getCreatedAt()),
                        moai.getBidStartDate(),
                        moai.getBidEndDate()
                ))
                .collect(Collectors.toList());
    }

    private List<Moai> getMoaisByUserRole(String id, String userRole) {
        return "admin".equalsIgnoreCase(userRole) ? moaiRepository.findAllByOrganizerId(id) : moaiRepository.findAll();
    }

    public MoaiResponseDTO save(MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findByNameAndValueAndYear(moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year());

        if (moaiDB.isPresent()) {
            throw new BadRequestException("Moai already exists!");
        }

        try {
            Moai moai = moaiRepository.save(new Moai(moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year(), moaiRequestDTO.rules(), moaiRequestDTO.duration(), moaiRequestDTO.status(), moaiRequestDTO.organizer(), LocalDateTime.now(), moaiRequestDTO.bidStartDate(), moaiRequestDTO.bidEndDate()));
            return new MoaiResponseDTO(moai.getId(), moai.getName(), moai.getValue(), moai.getYear(), moai.getRules(), moai.getDuration(), moai.getStatus(), moai.getOrganizer().id(), moai.getOrganizer().name(), new DateUtils().formatterLocalDateToString(moai.getCreatedAt()), moai.getBidStartDate(), moai.getBidEndDate());
        } catch (Exception e) {
            throw new BadRequestException("Unable to save the moai");
        }
    }

    public MoaiResponseDTO update(String id, MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findById(id);

        if (moaiDB.isPresent()) {
            Moai moai = moaiRepository.save(new Moai(id, moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year(), moaiRequestDTO.rules(), moaiRequestDTO.duration(), moaiRequestDTO.status(), moaiRequestDTO.organizer(), LocalDateTime.now(), moaiRequestDTO.bidStartDate(), moaiRequestDTO.bidEndDate()));
            return new MoaiResponseDTO(moai.getId(), moai.getName(), moai.getValue(), moai.getYear(), moai.getRules(), moai.getDuration(), moai.getStatus(), moai.getOrganizer().id(), moai.getOrganizer().name(), new DateUtils().formatterLocalDateToString(moai.getCreatedAt()), moai.getBidStartDate(), moai.getBidStartDate());
        } else {
            throw new NotFoundException("Moai not found!");
        }
    }

    public Object delete(String id) {
        // Fazer validação se existe participantes (Se existir não permitir exclusão).

        moaiRepository.deleteById(id);
        return null;
    }

    public void updateStatuses() {
        List<Moai> moais = moaiRepository.findAll();

        for (Moai moai : moais) {
            int durationInMonths = extractMonths(moai.getDuration());
            LocalDateTime creationDate = moai.getCreatedAt();
            LocalDateTime expirationDate = creationDate.plusMonths(durationInMonths);

            if (LocalDateTime.now().isAfter(expirationDate)) {
                moai.setStatus("Expired");
                moaiRepository.save(moai);
            }
        }
    }
    private int extractMonths(String duration) {
        Pattern pattern = Pattern.compile("(\\d+)\\s*(month|months)?", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(duration);

        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }

        return 0;
    }
}
