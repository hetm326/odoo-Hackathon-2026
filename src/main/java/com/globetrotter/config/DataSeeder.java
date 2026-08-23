package com.globetrotter.config;

import com.globetrotter.entity.*;
import com.globetrotter.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(UserRepository users, CityRepository cities,
                            ActivityRepository activities, PasswordEncoder encoder) {
        return args -> {
            if (!users.existsByEmail("admin@globetrotter.com")) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@globetrotter.com");
                admin.setPassword(encoder.encode("Admin@123"));
                admin.setRole(Role.ADMIN);
                users.save(admin);
            }

            if (cities.count() == 0) {
                City goa = city("Goa", "India", "West India", 55, 95);
                City paris = city("Paris", "France", "Europe", 90, 98);
                City tokyo = city("Tokyo", "Japan", "Asia", 85, 97);
                cities.save(goa);
                cities.save(paris);
                cities.save(tokyo);

                activities.save(activity("Baga Beach", "BEACH", "Relax at Baga Beach",
                        120, 500.0, goa));
                activities.save(activity("Eiffel Tower", "SIGHTSEEING", "Visit Eiffel Tower",
                        150, 2500.0, paris));
                activities.save(activity("Shibuya Crossing", "SIGHTSEEING", "Explore Shibuya",
                        90, 1000.0, tokyo));
            }
        };
    }

    private City city(String name, String country, String region, int cost, int popularity) {
        City c = new City();
        c.setName(name); c.setCountry(country); c.setRegion(region);
        c.setCostIndex(cost); c.setPopularity(popularity);
        return c;
    }

    private Activity activity(String name, String type, String desc, int duration,
                              double cost, City city) {
        Activity a = new Activity();
        a.setName(name); a.setType(type); a.setDescription(desc);
        a.setDurationMinutes(duration); a.setEstimatedCost(cost); a.setCity(city);
        return a;
    }
}
