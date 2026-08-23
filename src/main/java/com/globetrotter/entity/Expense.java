package com.globetrotter.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
public class Expense {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseType type;

    @Column(nullable = false)
    private Double amount;

    private String description;
    private LocalDate expenseDate;

    public Long getId() { return id; }
    public Trip getTrip() { return trip; }
    public ExpenseType getType() { return type; }
    public Double getAmount() { return amount; }
    public String getDescription() { return description; }
    public LocalDate getExpenseDate() { return expenseDate; }

    public void setId(Long id) { this.id = id; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public void setType(ExpenseType type) { this.type = type; }
    public void setAmount(Double amount) { this.amount = amount; }
    public void setDescription(String description) { this.description = description; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }
}
