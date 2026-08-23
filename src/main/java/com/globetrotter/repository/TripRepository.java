package com.globetrotter.repository;
import com.globetrotter.entity.Trip;
import com.globetrotter.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserOrderByStartDateDesc(User user);
    Optional<Trip> findByIdAndUser(Long id, User user);
    long countByUser(User user);
}
