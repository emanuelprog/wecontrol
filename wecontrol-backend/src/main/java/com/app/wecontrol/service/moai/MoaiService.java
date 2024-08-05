package com.app.wecontrol.service.moai;

import com.app.wecontrol.dtos.bid.BidResponseDTO;
import com.app.wecontrol.dtos.moai.*;
import com.app.wecontrol.models.moai.Moai;
import com.app.wecontrol.models.user.User;
import com.app.wecontrol.dtos.user.UserResponseDTO;
import com.app.wecontrol.exception.BadRequestException;
import com.app.wecontrol.exception.NotFoundException;
import com.app.wecontrol.repository.moai.MoaiRepository;
import com.app.wecontrol.repository.user.UserRepository;
import com.app.wecontrol.utils.MoaiUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class MoaiService {

    private final MoaiRepository moaiRepository;
    private final UserRepository userRepository;
    private final MoaiUtils moaiUtils;

    public List<MoaiResponseDTO> getMoais(String id) {
        User actualUser = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not exists!"));

        List<Moai> moais = getMoaisByUserRole(id, actualUser.getUserRole().getRole());

        if (moais.isEmpty()) {
            return new ArrayList<>();
        }

        return moais.stream()
                .map(moai -> {
                    List<MoaiMonthlyResponseDTO> sortedMonthlyList = Optional.ofNullable(moai.getMonthly())
                            .orElseGet(Collections::emptyList)
                            .stream()
                            .map(monthly -> {
                                List<BidResponseDTO> sortedBids = Optional.ofNullable(monthly.bids())
                                        .orElseGet(Collections::emptyList)
                                        .stream()
                                        .sorted(Comparator.comparing(BidResponseDTO::valueBid).reversed())
                                        .collect(Collectors.toList());

                                return new MoaiMonthlyResponseDTO(
                                        monthly.month(),
                                        moaiUtils.formatterLocalDateTimeToString(monthly.bidStartDate()),
                                        moaiUtils.formatterLocalDateTimeToString(monthly.bidEndDate()),
                                        monthly.bidStartDate(),
                                        monthly.bidEndDate(),
                                        monthly.status(),
                                        sortedBids
                                );
                            })
                            .collect(Collectors.toList());

                    return new MoaiResponseDTO(
                            moai.getId(),
                            moai.getName(),
                            moai.getValue(),
                            moai.getYear(),
                            moai.getRules(),
                            moai.getStatus(),
                            moai.getOrganizer(),
                            (moai.getParticipants() != null ? moai.getParticipants() : new ArrayList<>()),
                            sortedMonthlyList,
                            moaiUtils.formatterLocalDateToString(moai.getCreatedAt())
                    );
                })
                .collect(Collectors.toList());
    }

    public MoaiResponseDTO save(MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findByNameAndValueAndYear(moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year());

        if (moaiDB.isPresent()) {
            throw new BadRequestException("Moai already exists!");
        }

        try {
            Moai moai = moaiRepository.save(
                    new Moai(
                            moaiRequestDTO.name(),
                            moaiRequestDTO.value(),
                            moaiRequestDTO.year(),
                            moaiRequestDTO.rules(),
                            moaiRequestDTO.status(),
                            moaiRequestDTO.organizer(),
                            moaiRequestDTO.participants(),
                            moaiRequestDTO.monthly(),
                            LocalDateTime.now().minusHours(4)
                    )
            );

            return new MoaiResponseDTO(
                    moai.getId(),
                    moai.getName(),
                    moai.getValue(),
                    moai.getYear(),
                    moai.getRules(),
                    moai.getStatus(),
                    moai.getOrganizer(),
                    moai.getParticipants(),
                    moai.getMonthly(),
                    moaiUtils.formatterLocalDateToString(moai.getCreatedAt()
                    )
            );
        } catch (Exception e) {
            throw new BadRequestException("Unable to save the moai");
        }
    }

    public MoaiResponseDTO update(String id, MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findById(id);

        if (moaiDB.isPresent()) {
            Moai existingMoai = moaiDB.get();
            Moai updatedMoai = moaiRepository.save(
                    new Moai(
                            id,
                            moaiRequestDTO.name(),
                            moaiRequestDTO.value(),
                            moaiRequestDTO.year(),
                            moaiRequestDTO.rules(),
                            moaiRequestDTO.status(),
                            moaiRequestDTO.organizer(),
                            moaiRequestDTO.participants(),
                            generateListMonthly(existingMoai, moaiRequestDTO),
                            existingMoai.getCreatedAt()
                    )
            );

            return new MoaiResponseDTO(
                    updatedMoai.getId(),
                    updatedMoai.getName(),
                    updatedMoai.getValue(),
                    updatedMoai.getYear(),
                    updatedMoai.getRules(),
                    updatedMoai.getStatus(),
                    updatedMoai.getOrganizer(),
                    updatedMoai.getParticipants(),
                    (updatedMoai.getMonthly().isEmpty() ? generateListMonthly(existingMoai, moaiRequestDTO) : updatedMoai.getMonthly()),
                    moaiUtils.formatterLocalDateToString(updatedMoai.getCreatedAt()));
        } else {
            throw new NotFoundException("Moai not found!");
        }
    }

    public Object delete(String id) {
        moaiRepository.deleteById(id);
        return null;
    }

    private List<MoaiMonthlyResponseDTO> generateListMonthly(Moai moai, MoaiRequestDTO moaiRequestDTO) {
        LocalDate startDate = moai.getCreatedAt().plusMonths(1).toLocalDate();
        LocalDate currentDate = LocalDate.now();

        List<MoaiMonthlyResponseDTO> existingMonthlyList = Optional.ofNullable(moaiRequestDTO.monthly()).orElseGet(ArrayList::new);
        List<UserResponseDTO> existingParticipants = Optional.ofNullable(moai.getParticipants()).orElseGet(ArrayList::new);

        List<UserResponseDTO> newParticipants = moaiRequestDTO.participants();

        List<UserResponseDTO> participantsToAdd = newParticipants.stream()
                .filter(participant -> !existingParticipants.contains(participant))
                .collect(Collectors.toList());

        List<MoaiMonthlyResponseDTO> newMonthlyList = IntStream.range(0, participantsToAdd.size())
                .mapToObj(i -> {
                    LocalDate monthDate = startDate.plusMonths(existingMonthlyList.size() + i);
                    String month = monthDate.getMonth().name();
                    LocalDateTime bidStartDate = moaiUtils.getFirstBusinessDayOfMonth(monthDate);
                    LocalDateTime bidEndDate = moaiUtils.getFifthBusinessDayOfMonth(monthDate);

                    return new MoaiMonthlyResponseDTO(
                            month,
                            moaiUtils.formatterLocalDateTimeToString(bidStartDate),
                            moaiUtils.formatterLocalDateTimeToString(bidEndDate),
                            bidStartDate.minusHours(4),
                            bidEndDate.minusHours(4),
                            monthDate.getMonthValue() == currentDate.getMonthValue() && monthDate.getYear() == currentDate.getYear() ? "Open" : "Closed",
                            new ArrayList<>());
                })
                .collect(Collectors.toList());

        existingMonthlyList.addAll(newMonthlyList);

        return existingMonthlyList;
    }

    private List<Moai> getMoaisByUserRole(String userId, String userRole) {
        return "admin".equalsIgnoreCase(userRole) ? moaiRepository.findAllByOrganizerId(userId) : moaiRepository.findAll();
    }

    public void updateStatuses() {
        List<Moai> moais = moaiRepository.findAll();

        for (Moai moai : moais) {
            LocalDateTime creationDate = moai.getCreatedAt();
            LocalDateTime expirationDate = creationDate.plusMonths(moai.getParticipants().size());

            if (LocalDateTime.now().isAfter(expirationDate)) {
                moai.setStatus("Expired");
                moaiRepository.save(moai);
            }
        }
    }
}
