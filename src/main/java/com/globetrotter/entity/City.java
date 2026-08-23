package com.globetrotter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cities")
public class City {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String country;
    private String region;
    private Integer costIndex;
    private Integer popularity;
    private String imageUrl;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCountry() { return country; }
    public String getRegion() { return region; }
    public Integer getCostIndex() { return costIndex; }
    public Integer getPopularity() { return popularity; }
    public String getImageUrl() { return imageUrl; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCountry(String country) { this.country = country; }
    public void setRegion(String region) { this.region = region; }
    public void setCostIndex(Integer costIndex) { this.costIndex = costIndex; }
    public void setPopularity(Integer popularity) { this.popularity = popularity; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
