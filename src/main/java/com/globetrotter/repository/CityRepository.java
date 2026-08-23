package com.globetrotter.repository;
import com.globetrotter.entity.City;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findTop20ByNameContainingIgnoreCase(String name);
    List<City> findTop20ByCountryContainingIgnoreCase(String country);
}
