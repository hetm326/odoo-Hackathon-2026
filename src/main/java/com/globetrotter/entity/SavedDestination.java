package com.globetrotter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_destinations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "city_id"}))
public class SavedDestination {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "city_id")
    private City city;

    public Long getId() { return id; }
    public User getUser() { return user; }
    public City getCity() { return city; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setCity(City city) { this.city = city; }
}
