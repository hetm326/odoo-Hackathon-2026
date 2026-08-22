package com.globetrotter.dto;
import java.util.List;
import java.util.Map;
public record DashboardResponse(
    String welcomeMessage,
    List<?> recentTrips,
    List<?> recommendedCities,
    Map<String, Object> budgetHighlights
) {}
