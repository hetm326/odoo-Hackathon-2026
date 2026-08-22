package com.globetrotter.controller;

import com.globetrotter.dto.*;
import com.globetrotter.entity.*;
import com.globetrotter.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService service;

    public TripController(TripService service) {
        this.service = service;
    }

    @PostMapping
    public Trip create(Authentication auth, @Valid @RequestBody CreateTripRequest request) {
        return service.create(auth.getName(), request);
    }

    @GetMapping
    public Object list(Authentication auth) {
        return service.myTrips(auth.getName());
    }

    @GetMapping("/{id}")
    public Trip get(Authentication auth, @PathVariable Long id) {
        return service.getMine(auth.getName(), id);
    }

    @PutMapping("/{id}")
    public Trip update(Authentication auth, @PathVariable Long id,
                       @RequestBody UpdateTripRequest request) {
        return service.update(auth.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(Authentication auth, @PathVariable Long id) {
        service.delete(auth.getName(), id);
        return ResponseEntity.ok(Map.of("message", "Trip deleted"));
    }

    @PostMapping("/{id}/stops")
    public TripStop addStop(Authentication auth, @PathVariable Long id,
                            @Valid @RequestBody AddStopRequest request) {
        return service.addStop(auth.getName(), id, request);
    }

    @DeleteMapping("/{tripId}/stops/{stopId}")
    public ResponseEntity<?> deleteStop(Authentication auth, @PathVariable Long tripId,
                                        @PathVariable Long stopId) {
        service.deleteStop(auth.getName(), tripId, stopId);
        return ResponseEntity.ok(Map.of("message", "Stop deleted"));
    }

    @PostMapping("/{tripId}/stops/{stopId}/activities")
    public StopActivity addActivity(Authentication auth, @PathVariable Long tripId,
                                    @PathVariable Long stopId,
                                    @Valid @RequestBody AddActivityRequest request) {
        return service.addActivity(auth.getName(), tripId, stopId, request);
    }

    @DeleteMapping("/{tripId}/activities/{activityId}")
    public ResponseEntity<?> deleteActivity(Authentication auth, @PathVariable Long tripId,
                                            @PathVariable Long activityId) {
        service.deleteActivity(auth.getName(), tripId, activityId);
        return ResponseEntity.ok(Map.of("message", "Activity removed"));
    }

    @PostMapping("/{id}/expenses")
    public Expense addExpense(Authentication auth, @PathVariable Long id,
                              @Valid @RequestBody CreateExpenseRequest request) {
        return service.addExpense(auth.getName(), id, request);
    }

    @GetMapping("/{id}/budget")
    public Map<String, Object> budget(Authentication auth, @PathVariable Long id) {
        return service.budgetSummary(auth.getName(), id);
    }

    @PutMapping("/{id}/budget")
    public Budget saveBudget(Authentication auth, @PathVariable Long id,
                             @RequestBody BudgetRequest request) {
        return service.saveBudget(auth.getName(), id, request);
    }

    @PostMapping("/{id}/share")
    public Map<String, String> makePublic(Authentication auth, @PathVariable Long id) {
        service.setPublic(auth.getName(), id, true);
        return Map.of("message", "Trip marked public");
    }
}
