package com.app.wecontrol.controller.moai;

import com.app.wecontrol.dtos.defaultResponse.DefaultResponse;
import com.app.wecontrol.dtos.moai.MoaiRequestDTO;
import com.app.wecontrol.service.moai.MoaiService;
import com.app.wecontrol.utils.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moai")
@RequiredArgsConstructor
public class MoaiController {

    private final MoaiService moaiService;

    @GetMapping("/{id}")
    public ResponseEntity<DefaultResponse> findAll(@PathVariable String id) {
        return ResponseUtil.generateResponse("Moais loaded successfully!", HttpStatus.OK, moaiService.getMoais(id));
    }

    @PostMapping("/create")
    public ResponseEntity<DefaultResponse> create(@RequestBody MoaiRequestDTO data) {
        return ResponseUtil.generateResponse("Successfully create moai!", HttpStatus.CREATED, moaiService.save(data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DefaultResponse> update(@PathVariable String id, @RequestBody MoaiRequestDTO data) {
        return ResponseUtil.generateResponse("Successfully update moai!", HttpStatus.OK, moaiService.update(id, data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DefaultResponse> delete(@PathVariable String id) {
        return ResponseUtil.generateResponse("Moai successfully deleted!", HttpStatus.OK, moaiService.delete(id));
    }
}
