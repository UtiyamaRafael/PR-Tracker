package com.rafael.pr_gym_backend.controller;

import com.rafael.pr_gym_backend.dto.PrSummaryResponse;
import com.rafael.pr_gym_backend.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/prs")
    public List<PrSummaryResponse> resumoPRs() {
        return dashboardService.listarResumoPRs();
    }
}