package com.app.wecontrol.service.authentication;

import com.app.wecontrol.dtos.authentication.AuthenticationDTO;
import com.app.wecontrol.dtos.login.LoginResponseDTO;
import com.app.wecontrol.dtos.register.RegisterDTO;
import com.app.wecontrol.dtos.user.User;
import com.app.wecontrol.exception.BadRequestException;
import com.app.wecontrol.infra.security.TokenService;
import com.app.wecontrol.repository.UserRepository;
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
            var token = tokenService.generateToken((User) auth.getPrincipal());
            return new LoginResponseDTO(token, ((User) auth.getPrincipal()).getLogin());
        } catch (Exception e) {
            throw new BadRequestException("Unable to login");
        }
    }

    public User register(RegisterDTO registerDTO) {
        if (userRepository.findByLogin(registerDTO.login()) != null) {
            throw new BadRequestException("User already exists!");
        }
        try {
            String encryptedPassword = new BCryptPasswordEncoder().encode(registerDTO.password());
            User newUser = new User(registerDTO.login(), encryptedPassword, registerDTO.role());
            return userRepository.save(newUser);
        } catch (Exception e) {
            throw new BadRequestException("Unable to register!");
        }
    }
}
