package com.globetrotter.repository;
import com.globetrotter.entity.SharedTrip;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SharedTripRepository extends JpaRepository<SharedTrip, Long> {
    Optional<SharedTrip> findByToken(String token);
    Optional<SharedTrip> findByTripId(Long tripId);
}
