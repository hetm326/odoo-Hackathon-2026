package com.globetrotter.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trip_stops")
public class TripStop {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "city_id")
    private City city;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private Integer stopOrder;

    @OneToMany(mappedBy = "stop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StopActivity> activities = new ArrayList<>();

    public Long getId() { return id; }
    public Trip getTrip() { return trip; }
    public City getCity() { return city; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public Integer getStopOrder() { return stopOrder; }
    public List<StopActivity> getActivities() { return activities; }

    public void setId(Long id) { this.id = id; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public void setCity(City city) { this.city = city; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setStopOrder(Integer stopOrder) { this.stopOrder = stopOrder; }
}
