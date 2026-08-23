package com.globetrotter.service;

import com.globetrotter.dto.DashboardResponse;
import com.globetrotter.entity.City;
import com.globetrotter.entity.Trip;
import com.globetrotter.repository.CityRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    private final TripService tripService;
    private final CityRepository cityRepository;

    public DashboardService(TripService tripService, CityRepository cityRepository) {
        this.tripService = tripService;
        this.cityRepository = cityRepository;
    }

    public DashboardResponse dashboard(String email) {
        var user = tripService.currentUser(email);
        List<Trip> trips = tripService.myTrips(email);
        List<City> cities = cityRepository.findAll().stream().limit(10).toList();

        Map<String, Object> highlights = new HashMap<>();
        highlights.put("tripCount", trips.size());
        highlights.put("message", "Create a trip and set your budget");

        return new DashboardResponse(
                "Welcome, " + user.getName(),
                trips.stream().limit(5).toList(),
                cities,
                highlights
        );
    }
}
