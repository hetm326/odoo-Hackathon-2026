package com.globetrotter.repository;
import com.globetrotter.entity.TripStop;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TripStopRepository extends JpaRepository<TripStop, Long> {
    Optional<TripStop> findByIdAndTripId(Long id, Long tripId);
}
