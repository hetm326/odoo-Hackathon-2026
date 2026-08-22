package com.globetrotter.dto;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
public record AddActivityRequest(
    @NotNull Long activityId,
    LocalDate activityDate,
    LocalTime startTime,
    Double estimatedCost,
    Integer activityOrder
) {


}
