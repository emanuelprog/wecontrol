package com.app.wecontrol.service.authentication;

import com.app.wecontrol.dtos.authentication.AuthenticationDTO;
import com.app.wecontrol.dtos.authentication.RefreshTokenRequestDTO;
import com.app.wecontrol.dtos.login.LoginResponseDTO;
import com.app.wecontrol.dtos.register.RegisterDTO;
import com.app.wecontrol.dtos.resetPassword.ResetPasswordDTO;
import com.app.wecontrol.models.user.User;
import com.app.wecontrol.exception.BadRequestException;
import com.app.wecontrol.infra.security.TokenService;
import com.app.wecontrol.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public LoginResponseDTO login(AuthenticationDTO authenticationDTO) {
        try {
            UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(authenticationDTO.login(), authenticationDTO.password());
            var auth =  authenticationManager.authenticate(usernamePassword);
            var acessToken = tokenService.generateAcessToken((User) auth.getPrincipal());
            var refreshToken  = tokenService.generateRefreshToken((User) auth.getPrincipal());
            return new LoginResponseDTO(acessToken, refreshToken,
                    ((User) auth.getPrincipal()).getId(),
                    ((User) auth.getPrincipal()).getLogin(),
                    ((User) auth.getPrincipal()).getEmail(),
                    ((User) auth.getPrincipal()).getName(),
                    ((User) auth.getPrincipal()).getUserRole().getRole());
        } catch (Exception e) {
            throw new BadRequestException("Unable to login");
        }
    }

    public LoginResponseDTO refreshToken(RefreshTokenRequestDTO refreshTokenRequestDTO) {
        try {
            User user =  userRepository.findUserByLogin(refreshTokenRequestDTO.getLogin());
            var accessToken = tokenService.generateAcessToken(user);
            return new LoginResponseDTO(accessToken, refreshTokenRequestDTO.getRefreshToken(),
                    user.getId(),
                    user.getLogin(),
                    user.getEmail(),
                    user.getName(),
                    user.getUserRole().getRole());
        } catch (Exception e) {
            throw new BadRequestException("Unable to refresh token");
        }
    }

    public User register(RegisterDTO registerDTO) {
        if (userRepository.findByLogin(registerDTO.login()) != null) {
            throw new BadRequestException("User already exists!");
        }
        if (userRepository.findByEmail(registerDTO.email()) != null) {
            throw new BadRequestException("E-mail already exists!");
        }
        try {
            String encryptedPassword = new BCryptPasswordEncoder().encode(registerDTO.password());
            User newUser = new User(registerDTO.login(), encryptedPassword, registerDTO.role(), registerDTO.name(), registerDTO.email());
            return userRepository.save(newUser);
        } catch (Exception e) {
            throw new BadRequestException("Unable to register!");
        }
    }

    public String confirmEmail(String email) {
        if (userRepository.findByEmail(email) == null) {
            throw new BadRequestException("Email does not exist!");
        }
        return email;
    }

    public User resetPassword(ResetPasswordDTO data) {
        User user = userRepository.findByEmail(data.email());
        if (user == null) {
            throw new BadRequestException("Email does not exist!");
        }
        try {
            String encryptedPassword = new BCryptPasswordEncoder().encode(data.newPassword());
            User newUser = new User(user.getId(), user.getLogin(), encryptedPassword, user.getUserRole(), user.getName(), user.getEmail());
            return userRepository.save(newUser);
        } catch (Exception e) {
            throw new BadRequestException("Unable to reset password!");
        }
    }
}
