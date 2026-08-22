package com.globetrotter.dto;
import java.time.LocalDate;
public record UpdateTripRequest(String name, LocalDate startDate, LocalDate endDate, String description) {}
