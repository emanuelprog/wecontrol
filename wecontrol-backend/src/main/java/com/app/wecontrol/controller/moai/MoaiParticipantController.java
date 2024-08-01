package com.app.wecontrol.controller.moai;

import com.app.wecontrol.dtos.defaultResponse.DefaultResponse;
import com.app.wecontrol.dtos.moai.MoaiParticipantRequestDTO;
import com.app.wecontrol.dtos.moai.MoaiRequestDTO;
import com.app.wecontrol.service.moai.MoaiParticipantService;
import com.app.wecontrol.utils.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/moai-participant")
@RequiredArgsConstructor
public class MoaiParticipantController {
    private final MoaiParticipantService moaiParticipantService;

    @PostMapping("/create")
    public ResponseEntity<DefaultResponse> create(@RequestBody MoaiParticipantRequestDTO data) {
        return ResponseUtil.generateResponse("Congratulations! You are participating in the moai ", HttpStatus.CREATED, moaiParticipantService.save(data));
    }
}
