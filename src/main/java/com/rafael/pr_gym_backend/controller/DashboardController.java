package com.rafael.pr_gym_backend.controller;

import com.rafael.pr_gym_backend.dto.PrSummaryResponse;
import com.rafael.pr_gym_backend.model.User;
import com.rafael.pr_gym_backend.service.DashboardService;
import com.rafael.pr_gym_backend.util.AuthUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthUtil authUtil;

    public DashboardController(DashboardService dashboardService, AuthUtil authUtil) {
        this.dashboardService = dashboardService;
        this.authUtil = authUtil;
    }

    @GetMapping("/prs")
    public List<PrSummaryResponse> resumoPRs() {
        User user = authUtil.getCurrentUser();
        return dashboardService.listarResumoPRs(user);
    }
}