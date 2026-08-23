package com.globetrotter.dto;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
public record AddStopRequest(
    @NotNull Long cityId,
    @NotNull LocalDate startDate,
    @NotNull LocalDate endDate,
    Integer stopOrder
) {}
