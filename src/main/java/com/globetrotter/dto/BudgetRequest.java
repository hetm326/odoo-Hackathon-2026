package com.globetrotter.dto;
public record BudgetRequest(
    Double totalBudget,
    Double transportBudget,
    Double stayBudget,
    Double activityBudget,
    Double mealBudget
) {}
