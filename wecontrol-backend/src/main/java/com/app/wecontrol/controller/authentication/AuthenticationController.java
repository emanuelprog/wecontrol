package com.app.wecontrol.controller.authentication;

import com.app.wecontrol.dtos.authentication.AuthenticationDTO;
import com.app.wecontrol.dtos.defaultResponse.DefaultResponse;
import com.app.wecontrol.dtos.register.RegisterDTO;
import com.app.wecontrol.service.authentication.AuthenticationService;
import com.app.wecontrol.utils.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    @PostMapping("/login")
    public ResponseEntity<DefaultResponse> login(@RequestBody AuthenticationDTO data) {
        return ResponseUtil.generateResponse("User logged in successfully!", HttpStatus.OK, authenticationService.login(data));
    }

    @PostMapping("/register")
    public ResponseEntity<DefaultResponse> register(@RequestBody RegisterDTO data) {
        return ResponseUtil.generateResponse("Successfully registered user!", HttpStatus.CREATED, authenticationService.register(data));
    }
}
