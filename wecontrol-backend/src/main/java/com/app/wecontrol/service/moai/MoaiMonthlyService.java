package com.app.wecontrol.service.moai;

import com.app.wecontrol.dtos.moai.Moai;
import com.app.wecontrol.dtos.moai.MoaiMonthly;
import com.app.wecontrol.dtos.moai.MoaiMonthlyResponseDTO;
import com.app.wecontrol.exception.BadRequestException;
import com.app.wecontrol.repository.moai.MoaiMonthlyRepository;
import com.app.wecontrol.repository.moai.MoaiRepository;
import com.app.wecontrol.utils.MoaiUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class MoaiMonthlyService {
    private final MoaiMonthlyRepository moaiMonthlyRepository;
    private final MoaiRepository moaiRepository;
    private final MoaiUtils moaiUtils;

    public List<MoaiMonthlyResponseDTO> getMoaisMonthly(String id) {
        Moai moai = moaiRepository.findById(id).orElseThrow(() -> new BadRequestException("Moai not exists!"));

        List<MoaiMonthly> moaisMonthly = moaiMonthlyRepository.findByIdMoai(moai.getId());

        if (moaisMonthly.isEmpty()) {
            return new ArrayList<>();
        }

        return moaisMonthly.stream()
                .map(moaiMonthly -> new MoaiMonthlyResponseDTO(
                        moaiMonthly.getId(),
                        moaiMonthly.getIdMoai(),
                        moaiMonthly.getMonth(),
                        moaiUtils.convertLocalDateTimeToString(moaiMonthly.getBidStartDate().plusDays(1).plusHours(4)),
                        moaiUtils.convertLocalDateTimeToString(moaiMonthly.getBidEndDate().plusHours(4)),
                        moaiMonthly.getBids(),
                        moaiMonthly.getStatus()
                ))
                .collect(Collectors.toList());
    }

    public void save(Moai moai) {
        List<MoaiMonthly> moaiMonthlyList = createMoaiMonthly(moai);
        moaiMonthlyRepository.saveAll(moaiMonthlyList);
    }

    public void update(Moai moai, int oldDuration, int newDuration) {
        updateMoaiMonthly(moai, oldDuration, newDuration);
    }

    private List<MoaiMonthly> createMoaiMonthly(Moai moai) {
        return createMoaiMonthly(moai, 0, moaiUtils.extractMonths(moai.getDuration()));
    }

    private List<MoaiMonthly> createMoaiMonthly(Moai moai, int startMonth, int endMonth) {
        LocalDate startDate = moai.getCreatedAt().plusMonths(1).toLocalDate(); // Começar no próximo mês após a data de criação
        LocalDate currentDate = LocalDate.now();

        return IntStream.range(startMonth, endMonth)
                .mapToObj(i -> {
                    LocalDate monthDate = startDate.plusMonths(i);
                    String month = monthDate.getMonth().name();
                    LocalDateTime bidStartDate = moaiUtils.getFirstBusinessDayOfMonth(monthDate);
                    LocalDateTime bidEndDate = moaiUtils.getFifthBusinessDayOfMonth(monthDate);

                    MoaiMonthly moaiMonthly = new MoaiMonthly();
                    moaiMonthly.setIdMoai(moai.getId());
                    moaiMonthly.setMonth(month);
                    moaiMonthly.setBidStartDate(bidStartDate);
                    moaiMonthly.setBidEndDate(bidEndDate);
                    moaiMonthly.setBids(null);
                    moaiMonthly.setStatus(monthDate.getMonthValue() == currentDate.getMonthValue() && monthDate.getYear() == currentDate.getYear() ? "Open" : "Closed");

                    return moaiMonthly;
                })
                .collect(Collectors.toList());
    }

    public void updateMoaiMonthly(Moai moai, int oldDuration, int newDuration) {
        if (newDuration > oldDuration) {
            List<MoaiMonthly> newMoaiMonthlyList = createMoaiMonthly(moai, oldDuration, newDuration);
            moaiMonthlyRepository.saveAll(newMoaiMonthlyList);
        } else if (newDuration < oldDuration) {
            List<MoaiMonthly> moaiMonthlyList = moaiMonthlyRepository.findByIdMoai(moai.getId());
            List<MoaiMonthly> toDelete = moaiMonthlyList.subList(newDuration, moaiMonthlyList.size())
                    .stream()
                    .filter(moaiMonthly -> moaiMonthly.getBids() == null)
                    .collect(Collectors.toList());
            moaiMonthlyRepository.deleteAll(toDelete);
        }
    }

    public void updateStatusesMoaiMonthly() {
        LocalDate currentDate = LocalDate.now();
        List<MoaiMonthly> moaiMonthlyList = moaiMonthlyRepository.findAll();

        for (MoaiMonthly moaiMonthly : moaiMonthlyList) {
            LocalDate monthDate = LocalDate.parse(moaiMonthly.getMonth() + " 01", DateTimeFormatter.ofPattern("MMMM dd yyyy"));
            if (monthDate.getMonthValue() == currentDate.getMonthValue() && monthDate.getYear() == currentDate.getYear()) {
                moaiMonthly.setStatus("Open");
            } else {
                moaiMonthly.setStatus("Closed");
            }
        }

        moaiMonthlyRepository.saveAll(moaiMonthlyList);
    }
}
