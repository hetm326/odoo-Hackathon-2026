package com.globetrotter.controller;

import com.globetrotter.entity.SharedTrip;
import com.globetrotter.repository.SharedTripRepository;
import com.globetrotter.repository.TripRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    private final SharedTripRepository sharedTripRepository;
    private final TripRepository tripRepository;

    public PublicController(SharedTripRepository sharedTripRepository, TripRepository tripRepository) {
        this.sharedTripRepository = sharedTripRepository;
        this.tripRepository = tripRepository;
    }

    @PostMapping("/trips/{tripId}/share")
    public Map<String, String> createShareLink(@PathVariable Long tripId) {
        var trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (!trip.isPublicTrip()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Trip is not public");
        }

        SharedTrip shared = sharedTripRepository.findByTripId(tripId).orElseGet(SharedTrip::new);
        shared.setTrip(trip);
        if (shared.getToken() == null) shared.setToken(UUID.randomUUID().toString());
        sharedTripRepository.save(shared);

        return Map.of(
                "token", shared.getToken(),
                "url", "/api/public/trips/" + shared.getToken()
        );
    }

    @GetMapping("/trips/{token}")
    public Object getPublicTrip(@PathVariable String token) {
        SharedTrip shared = sharedTripRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shared trip not found"));
        if (!shared.getTrip().isPublicTrip()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Trip is not public");
        }
        return shared.getTrip();
    }
}
