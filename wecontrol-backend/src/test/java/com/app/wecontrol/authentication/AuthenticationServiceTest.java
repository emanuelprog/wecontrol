package com.app.wecontrol.authentication;

import com.app.wecontrol.dtos.authentication.AuthenticationDTO;
import com.app.wecontrol.dtos.register.RegisterDTO;
import com.app.wecontrol.dtos.resetPassword.ResetPasswordDTO;
import com.app.wecontrol.exception.BadRequestException;
import com.app.wecontrol.models.user.User;
import com.app.wecontrol.models.user.UserRole;
import com.app.wecontrol.repository.user.UserRepository;
import com.app.wecontrol.service.authentication.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class AuthenticationServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_Failure() {
        when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException());

        assertThrows(BadRequestException.class, () -> authenticationService.login(new AuthenticationDTO("user", "pass")));
    }

    @Test
    void register_Successful() {
        RegisterDTO registerDTO = new RegisterDTO("newUser", "newPassword", UserRole.USER, "New User", "newuser@example.com", "123456789");

        when(userRepository.findByLogin("newUser")).thenReturn(null);
        when(userRepository.findByEmail("newuser@example.com")).thenReturn(null);
        when(userRepository.save(any(User.class))).thenReturn(new User());

        User user = authenticationService.register(registerDTO);

        assertNotNull(user);
    }

    @Test
    void register_UserAlreadyExists() {
        when(userRepository.findByLogin("existingUser")).thenReturn(new User());

        assertThrows(BadRequestException.class, () -> authenticationService.register(new RegisterDTO("existingUser", "pass", UserRole.USER, "User", "user@example.com", "123456789")));
    }

    @Test
    void resetPassword_Successful() {
        ResetPasswordDTO resetPasswordDTO = new ResetPasswordDTO("existinguser@example.com", "newPassword");
        User existingUser = new User();

        when(userRepository.findByEmail("existinguser@example.com")).thenReturn(existingUser);
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        User user = authenticationService.resetPassword(resetPasswordDTO);

        assertNotNull(user);
    }

    @Test
    void resetPassword_EmailNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(null);

        assertThrows(BadRequestException.class, () -> authenticationService.resetPassword(new ResetPasswordDTO("nonexistent@example.com", "newPassword")));
    }
}
