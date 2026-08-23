package com.globetrotter.repository;
import com.globetrotter.entity.Budget;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByTripId(Long tripId);
}
