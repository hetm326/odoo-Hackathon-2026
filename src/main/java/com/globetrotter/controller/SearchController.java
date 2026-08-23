package com.globetrotter.controller;

import com.globetrotter.entity.*;
import com.globetrotter.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchController {
    private final CityRepository cityRepository;
    private final ActivityRepository activityRepository;

    public SearchController(CityRepository cityRepository, ActivityRepository activityRepository) {
        this.cityRepository = cityRepository;
        this.activityRepository = activityRepository;
    }

    @GetMapping("/cities")
    public List<City> cities(@RequestParam(defaultValue = "") String search) {
        if (search.isBlank()) return cityRepository.findAll().stream().limit(20).toList();
        return cityRepository.findTop20ByNameContainingIgnoreCase(search);
    }

    @GetMapping("/activities")
    public List<Activity> activities(
            @RequestParam(required = false) Long cityId,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) String type) {

        if (cityId != null && type != null && !type.isBlank()) {
            return activityRepository.findTop30ByCityIdAndTypeIgnoreCase(cityId, type);
        }
        if (cityId != null) return activityRepository.findTop30ByCityId(cityId);
        if (!search.isBlank()) return activityRepository.findTop30ByNameContainingIgnoreCase(search);
        return activityRepository.findAll().stream().limit(30).toList();
    }
}
