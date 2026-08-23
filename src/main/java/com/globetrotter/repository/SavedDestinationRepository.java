package com.globetrotter.repository;
import com.globetrotter.entity.SavedDestination;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SavedDestinationRepository extends JpaRepository<SavedDestination, Long> {
    List<SavedDestination> findByUserId(Long userId);
    Optional<SavedDestination> findByUserIdAndCityId(Long userId, Long cityId);
}
