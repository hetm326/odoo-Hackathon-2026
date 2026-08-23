package com.globetrotter.controller;

import com.globetrotter.dto.ProfileRequest;
import com.globetrotter.entity.User;
import com.globetrotter.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class ProfileController {
    private final ProfileService service;

    public ProfileController(ProfileService service) { this.service = service; }

    @GetMapping("/profile")
    public User profile(Authentication auth) {
        return service.get(auth.getName());
    }

    @PutMapping("/profile")
    public User update(Authentication auth, @RequestBody ProfileRequest request) {
        return service.update(auth.getName(), request);
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> delete(Authentication auth) {
        service.delete(auth.getName());
        return ResponseEntity.ok(Map.of("message", "Account deleted"));
    }
}
