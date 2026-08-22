package com.globetrotter.dto;
import com.globetrotter.entity.ExpenseType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
public record CreateExpenseRequest(
    @NotNull ExpenseType type,
    @NotNull Double amount,
    String description,
    LocalDate expenseDate
) {}
