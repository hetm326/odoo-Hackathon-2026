package com.globetrotter.repository;
import com.globetrotter.entity.Activity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findTop30ByNameContainingIgnoreCase(String name);
    List<Activity> findTop30ByCityId(Long cityId);
    List<Activity> findTop30ByCityIdAndTypeIgnoreCase(Long cityId, String type);
}
