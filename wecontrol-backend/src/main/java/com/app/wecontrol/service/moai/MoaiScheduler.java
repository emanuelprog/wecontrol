package com.app.wecontrol.service.moai;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class MoaiScheduler {
    private final MoaiService moaiService;

    public MoaiScheduler(MoaiService moaiService) {
        this.moaiService = moaiService;
    }

    @Scheduled(fixedRate = 60000)
    public void updateMoaiStatuses() {
        moaiService.updateStatuses();
        moaiService.updateStatusesMonthly();
    }
}
