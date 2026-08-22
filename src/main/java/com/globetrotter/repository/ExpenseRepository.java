package com.globetrotter.repository;
import com.globetrotter.entity.Expense;
import com.globetrotter.entity.Trip;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByTrip(Trip trip);
}
