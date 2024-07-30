package com.app.wecontrol.controller.authentication;

import com.app.wecontrol.dtos.authentication.AuthenticationDTO;
import com.app.wecontrol.dtos.authentication.RefreshTokenRequestDTO;
import com.app.wecontrol.dtos.defaultResponse.DefaultResponse;
import com.app.wecontrol.dtos.register.RegisterDTO;
import com.app.wecontrol.dtos.resetPassword.ResetPasswordDTO;
import com.app.wecontrol.service.authentication.AuthenticationService;
import com.app.wecontrol.utils.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    @PostMapping("/login")
    public ResponseEntity<DefaultResponse> login(@RequestBody AuthenticationDTO data) {
        return ResponseUtil.generateResponse("Successfully Logged In!", HttpStatus.OK, authenticationService.login(data));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<DefaultResponse> refreshToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO) {
        return ResponseUtil.generateResponse("Token refreshed!", HttpStatus.OK, authenticationService.refreshToken(refreshTokenRequestDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<DefaultResponse> register(@RequestBody RegisterDTO data) {
        return ResponseUtil.generateResponse("Successfully registered user!", HttpStatus.CREATED, authenticationService.register(data));
    }

    @PostMapping("/confirm-email")
    public ResponseEntity<DefaultResponse> confirmEmail(@RequestBody String email) {
        return ResponseUtil.generateResponse("E-mail confirmed successfully!", HttpStatus.OK, authenticationService.confirmEmail(email));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<DefaultResponse> resetPassword(@RequestBody ResetPasswordDTO data) {
        return ResponseUtil.generateResponse("Password reset successfully!", HttpStatus.OK, authenticationService.resetPassword(data));
    }
}
