package com.app.wecontrol.service.moai;

import com.app.wecontrol.dtos.moai.Moai;
import com.app.wecontrol.dtos.moai.MoaiRequestDTO;
import com.app.wecontrol.dtos.moai.MoaiResponseDTO;
import com.app.wecontrol.exception.BadRequestException;
import com.app.wecontrol.exception.NotFoundException;
import com.app.wecontrol.repository.moai.MoaiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MoaiService {

    private final MoaiRepository moaiRepository;

    public List<MoaiResponseDTO> getMoais() {
        List<Moai> moais = moaiRepository.findAll();

        if (moais.isEmpty()) {
            throw new NotFoundException("List of moais not found");
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
                        moai.getOrganizer().name()
                ))
                .collect(Collectors.toList());
    }

    public MoaiResponseDTO save(MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findByNameAndValueAndYear(moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year());

        if (moaiDB.isPresent()) {
            throw new BadRequestException("Moai already exists!");
        }

        try {
            Moai moai = moaiRepository.save(new Moai(moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year(), moaiRequestDTO.rules(), moaiRequestDTO.duration(), moaiRequestDTO.status(), moaiRequestDTO.organizer()));
            return new MoaiResponseDTO(moai.getId(), moai.getName(), moai.getValue(), moai.getYear(), moai.getRules(), moai.getDuration(), moai.getStatus(), moai.getOrganizer().id(), moai.getOrganizer().name());
        } catch (Exception e) {
            throw new BadRequestException("Unable to save the moai");
        }
    }

    public MoaiResponseDTO update(String id, MoaiRequestDTO moaiRequestDTO) {
        Optional<Moai> moaiDB = moaiRepository.findById(id);

        if (moaiDB.isPresent()) {
            Moai moai = moaiRepository.save(new Moai(id, moaiRequestDTO.name(), moaiRequestDTO.value(), moaiRequestDTO.year(), moaiRequestDTO.rules(), moaiRequestDTO.duration(), moaiRequestDTO.status(), moaiRequestDTO.organizer()));
            return new MoaiResponseDTO(moai.getId(), moai.getName(), moai.getValue(), moai.getYear(), moai.getRules(), moai.getDuration(), moai.getStatus(), moai.getOrganizer().id(), moai.getOrganizer().name());
        } else {
            throw new NotFoundException("Moai not found!");
        }
    }

    public Object delete(String id) {
        // Fazer validação se existe participantes (Se existir não permitir exclusão).

        moaiRepository.deleteById(id);
        return null;
    }
}
