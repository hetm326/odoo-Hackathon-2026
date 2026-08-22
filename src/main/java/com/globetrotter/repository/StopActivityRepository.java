package com.globetrotter.repository;
import com.globetrotter.entity.StopActivity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface StopActivityRepository extends JpaRepository<StopActivity, Long> {
    Optional<StopActivity> findByIdAndStopTripId(Long id, Long tripId);
}
