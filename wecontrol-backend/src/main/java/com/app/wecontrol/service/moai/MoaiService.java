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

        return moais.stream()
                .map(MoaiResponseDTO::moaiResponseDTOfromMoai)
                .collect(Collectors.toList());
    }

    public MoaiResponseDTO save(MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findByNameAndValueAndYear(moaiRequestDTO.getName(), moaiRequestDTO.getValue(), moaiRequestDTO.getYear());

        if (moaiDB.isPresent()) {
            throw new BadRequestException("Moai already exists!");
        }

        try {
            Moai moai = moaiRepository.save(Moai.createMoaiFromRequest(moaiRequestDTO));

            return MoaiResponseDTO.moaiResponseDTOfromMoai(moai);
        } catch (Exception e) {
            throw new BadRequestException("Unable to save the moai");
        }
    }

    public MoaiResponseDTO update(String id, MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findById(id);

        if (moaiDB.isPresent()) {
            Moai existingMoai = moaiDB.get();
            Moai updatedMoai = moaiRepository.save(
                    Moai.createMoaiFromRequestAndParams(id, moaiRequestDTO, generateListMonthly(existingMoai, moaiRequestDTO), existingMoai.getCreatedAt())
            );

            return MoaiResponseDTO.moaiResponseDTOfromMoai(updatedMoai);
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

        List<MoaiMonthlyResponseDTO> existingMonthlyList = Optional.ofNullable(moaiRequestDTO.getMonthly())
                .orElseGet(ArrayList::new)
                .stream()
                .map(MoaiMonthlyResponseDTO::moaiMonthlyResponseDTOfromMoaiMonthlyRequestDTO)
                .collect(Collectors.toList());

        List<UserResponseDTO> existingParticipants = Optional.ofNullable(moai.getParticipants()).orElseGet(ArrayList::new);

        List<UserResponseDTO> newParticipants = Optional.ofNullable(moaiRequestDTO.getParticipants())
                .orElseGet(ArrayList::new)
                .stream()
                .map(UserResponseDTO::userResponseDTOfromUserRequestDTO)
                .collect(Collectors.toList());

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
                            monthDate.getMonthValue() == currentDate.getMonthValue() && monthDate.getYear() == currentDate.getYear() ? "Open" : "Closed",
                            new ArrayList<>(),
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
            if (moai.getStatus().equals("Open")) {
                if (moai.getParticipants() != null && moai.getParticipants().size() > 0) {
                    if (LocalDateTime.now().isAfter(moai.getCreatedAt().plusMonths(1))) {
                        moai.setStatus("Expired");
                        moaiRepository.save(moai);
                    }
                }
            }
        }
    }

    public void updateStatusesMonthly() {
        List<Moai> moais = moaiRepository.findAll();

        moais.stream()
                .filter(moai -> moai.getMonthly() != null && !moai.getMonthly().isEmpty())
                .forEach(moai -> {
                    List<MoaiMonthlyResponseDTO> monthlyList = moai.getMonthly();
                    monthlyList.sort(Comparator.comparing(m -> moaiUtils.formatterStringToLocalDateTime(m.getBidStartDate())));

                    List<MoaiMonthlyResponseDTO> updatedMonthlyList = new ArrayList<>();
                    for (int i = 0; i < monthlyList.size(); i++) {
                        MoaiMonthlyResponseDTO monthly = monthlyList.get(i);
                        LocalDateTime bidStartDate = moaiUtils.formatterStringToLocalDateTime(monthly.getBidStartDate());
                        LocalDateTime nextBidStartDate = (i < monthlyList.size() - 1)
                                ? moaiUtils.formatterStringToLocalDateTime(monthlyList.get(i + 1).getBidStartDate())
                                : LocalDateTime.MAX;

                        String status = (LocalDateTime.now().isAfter(bidStartDate) && LocalDateTime.now().isBefore(nextBidStartDate))
                                ? "Open"
                                : "Closed";

                        monthly.setStatus(status);
                        updatedMonthlyList.add(monthly);
                    }

                    moai.setMonthly(updatedMonthlyList);
                    moaiRepository.save(moai);
                });
    }
}
