package com.globetrotter.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "activities_in_stop")
public class StopActivity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "stop_id")
    private TripStop stop;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "activity_id")
    private Activity activity;

    private LocalDate activityDate;
    private LocalTime startTime;
    private Double estimatedCost;
    private Integer activityOrder;

    public Long getId() { return id; }
    public TripStop getStop() { return stop; }
    public Activity getActivity() { return activity; }
    public LocalDate getActivityDate() { return activityDate; }
    public LocalTime getStartTime() { return startTime; }
    public Double getEstimatedCost() { return estimatedCost; }
    public Integer getActivityOrder() { return activityOrder; }

    public void setId(Long id) { this.id = id; }
    public void setStop(TripStop stop) { this.stop = stop; }
    public void setActivity(Activity activity) { this.activity = activity; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }
    public void setActivityOrder(Integer activityOrder) { this.activityOrder = activityOrder; }
}
