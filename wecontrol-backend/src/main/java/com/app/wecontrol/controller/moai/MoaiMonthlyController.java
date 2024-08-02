package com.app.wecontrol.controller.moai;

import com.app.wecontrol.dtos.defaultResponse.DefaultResponse;
import com.app.wecontrol.dtos.bid.BidRequestDTO;
import com.app.wecontrol.service.moai.MoaiMonthlyService;
import com.app.wecontrol.utils.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moai-monthly")
@RequiredArgsConstructor
public class MoaiMonthlyController {

    private final MoaiMonthlyService moaiMonthlyService;
    @GetMapping("/{id}")
    public ResponseEntity<DefaultResponse> findAllByMoaiId(@PathVariable String id) {
        return ResponseUtil.generateResponse("Moais monthly loaded successfully!", HttpStatus.OK, moaiMonthlyService.getMoaisMonthly(id));
    }

    @PostMapping("/bid")
    public ResponseEntity<DefaultResponse> bid(@RequestBody BidRequestDTO data) {
        return ResponseUtil.generateResponse("Successful bid", HttpStatus.OK, moaiMonthlyService.bid(data));
    }

    @PutMapping("/bid/{id}")
    public ResponseEntity<DefaultResponse> editBid(@PathVariable String id, @RequestBody BidRequestDTO data) {
        return ResponseUtil.generateResponse("Successful edit bid", HttpStatus.OK, moaiMonthlyService.editBid(data, id));
    }

    @DeleteMapping("/bid/{id}")
    public ResponseEntity<DefaultResponse> deleteBid(@PathVariable String id) {
        return ResponseUtil.generateResponse("Successful delete bid", HttpStatus.OK, moaiMonthlyService.deleteBid(id));
    }
}
