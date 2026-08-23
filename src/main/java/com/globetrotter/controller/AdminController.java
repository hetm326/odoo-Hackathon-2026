package com.globetrotter.controller;

import com.globetrotter.entity.*;
import com.globetrotter.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final CityRepository cityRepository;
    private final ActivityRepository activityRepository;

    public AdminController(UserRepository userRepository, TripRepository tripRepository,
                           CityRepository cityRepository, ActivityRepository activityRepository) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.cityRepository = cityRepository;
        this.activityRepository = activityRepository;
    }

    @GetMapping("/analytics")
    public Map<String, Object> analytics() {
        return Map.of(
            "users", userRepository.count(),
            "trips", tripRepository.count(),
            "cities", cityRepository.count(),
            "activities", activityRepository.count()
        );
    }

    @GetMapping("/users")
    public Object users() { return userRepository.findAll(); }

    @GetMapping("/trips")
    public Object trips() { return tripRepository.findAll(); }
}
