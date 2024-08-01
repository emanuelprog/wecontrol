package com.app.wecontrol.controller.moai;

import com.app.wecontrol.dtos.defaultResponse.DefaultResponse;
import com.app.wecontrol.service.moai.MoaiMonthlyService;
import com.app.wecontrol.utils.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/moai-monthly")
@RequiredArgsConstructor
public class MoaiMonthlyController {

    private final MoaiMonthlyService moaiMonthlyService;
    @GetMapping("/{id}")
    public ResponseEntity<DefaultResponse> findAllByMoaiId(@PathVariable String id) {
        return ResponseUtil.generateResponse("Moais monthly loaded successfully!", HttpStatus.OK, moaiMonthlyService.getMoaisMonthly(id));
    }
}
