package com.app.wecontrol.service.moai;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class MoaiScheduler {
    private final MoaiService moaiService;
    private final MoaiMonthlyService moaiMonthlyService;

    public MoaiScheduler(MoaiService moaiService, MoaiMonthlyService moaiMonthlyService) {
        this.moaiService = moaiService;
        this.moaiMonthlyService = moaiMonthlyService;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void updateMoaiStatuses() {
        moaiService.updateStatuses();
        moaiMonthlyService.updateStatusesMoaiMonthly();
    }
}
