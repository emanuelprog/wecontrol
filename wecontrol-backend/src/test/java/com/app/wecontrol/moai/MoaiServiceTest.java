package com.app.wecontrol.moai;
import com.app.wecontrol.dtos.moai.MoaiRequestDTO;
import com.app.wecontrol.dtos.moai.MoaiResponseDTO;
import com.app.wecontrol.dtos.user.UserResponseDTO;
import com.app.wecontrol.exception.BadRequestException;
import com.app.wecontrol.exception.NotFoundException;
import com.app.wecontrol.models.moai.Moai;
import com.app.wecontrol.models.user.User;
import com.app.wecontrol.models.user.UserRole;
import com.app.wecontrol.repository.moai.MoaiRepository;
import com.app.wecontrol.repository.user.UserRepository;
import com.app.wecontrol.service.moai.MoaiService;
import com.app.wecontrol.utils.MoaiUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class MoaiServiceTest {

    @Mock
    private MoaiRepository moaiRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MoaiService moaiService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getMoais_ShouldReturnMoais_WhenUserExists() {
        String userId = "1";
        User user = mock(User.class);
        Moai moai = mock(Moai.class);

        when(moai.getCreatedAt()).thenReturn(LocalDateTime.now());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(user.getUserRole()).thenReturn(UserRole.USER);
        when(moaiRepository.findAll()).thenReturn(List.of(moai));

        List<MoaiResponseDTO> result = moaiService.getMoais(userId);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        verify(userRepository, times(1)).findById(userId);
        verify(moaiRepository, times(1)).findAll();
    }

    @Test
    void getMoais_ShouldThrowException_WhenUserDoesNotExist() {
        String userId = "1";
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> moaiService.getMoais(userId));
        verify(userRepository, times(1)).findById(userId);
        verify(moaiRepository, never()).findAll();
    }

    @Test
    void update_ShouldThrowException_WhenMoaiIsNotFound() {
        String moaiId = "1";
        MoaiRequestDTO moaiRequestDTO = mock(MoaiRequestDTO.class);

        when(moaiRepository.findById(moaiId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> moaiService.update(moaiId, moaiRequestDTO));
        verify(moaiRepository, times(1)).findById(moaiId);
        verify(moaiRepository, never()).save(any(Moai.class));
    }

    @Test
    void delete_ShouldDeleteMoai_WhenMoaiExists() {
        String moaiId = "1";

        moaiService.delete(moaiId);

        verify(moaiRepository, times(1)).deleteById(moaiId);
    }

    @Test
    void updateStatuses_ShouldUpdateMoaiStatusToExpired_WhenConditionsAreMet() {
        Moai moai = mock(Moai.class);
        when(moai.getStatus()).thenReturn("Open");
        when(moai.getParticipants()).thenReturn(List.of(mock(UserResponseDTO.class)));
        when(moai.getCreatedAt()).thenReturn(LocalDateTime.now().minusMonths(2));

        when(moaiRepository.findAll()).thenReturn(List.of(moai));

        moaiService.updateStatuses();

        verify(moai, times(1)).setStatus("Expired");
        verify(moaiRepository, times(1)).save(moai);
    }
}
