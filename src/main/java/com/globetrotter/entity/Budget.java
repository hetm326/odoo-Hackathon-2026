package com.globetrotter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trip_id", unique = true)
    private Trip trip;

    private Double totalBudget;
    private Double transportBudget;
    private Double stayBudget;
    private Double activityBudget;
    private Double mealBudget;

    public Long getId() { return id; }
    public Trip getTrip() { return trip; }
    public Double getTotalBudget() { return totalBudget; }
    public Double getTransportBudget() { return transportBudget; }
    public Double getStayBudget() { return stayBudget; }
    public Double getActivityBudget() { return activityBudget; }
    public Double getMealBudget() { return mealBudget; }

    public void setId(Long id) { this.id = id; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public void setTotalBudget(Double totalBudget) { this.totalBudget = totalBudget; }
    public void setTransportBudget(Double transportBudget) { this.transportBudget = transportBudget; }
    public void setStayBudget(Double stayBudget) { this.stayBudget = stayBudget; }
    public void setActivityBudget(Double activityBudget) { this.activityBudget = activityBudget; }
    public void setMealBudget(Double mealBudget) { this.mealBudget = mealBudget; }
}
