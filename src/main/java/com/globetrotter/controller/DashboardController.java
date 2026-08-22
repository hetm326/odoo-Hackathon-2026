package com.globetrotter.controller;

import com.globetrotter.dto.DashboardResponse;
import com.globetrotter.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService service;
    public DashboardController(DashboardService service) { this.service = service; }

    @GetMapping
    public DashboardResponse dashboard(Authentication auth) {
        return service.dashboard(auth.getName());
    }
}
