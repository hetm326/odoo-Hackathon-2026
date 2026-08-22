package com.globetrotter.service;

import com.globetrotter.dto.*;
import com.globetrotter.entity.*;
import com.globetrotter.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final TripStopRepository stopRepository;
    private final ActivityRepository activityRepository;
    private final StopActivityRepository stopActivityRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    public TripService(TripRepository tripRepository, UserRepository userRepository, CityRepository cityRepository,
                       TripStopRepository stopRepository, ActivityRepository activityRepository,
                       StopActivityRepository stopActivityRepository, ExpenseRepository expenseRepository,
                       BudgetRepository budgetRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.cityRepository = cityRepository;
        this.stopRepository = stopRepository;
        this.activityRepository = activityRepository;
        this.stopActivityRepository = stopActivityRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    public User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    public Trip create(String email, CreateTripRequest request) {
        validateDates(request.startDate(), request.endDate());
        Trip trip = new Trip();
        trip.setUser(currentUser(email));
        trip.setName(request.name());
        trip.setStartDate(request.startDate());
        trip.setEndDate(request.endDate());
        trip.setDescription(request.description());
        return tripRepository.save(trip);
    }

    public List<Trip> myTrips(String email) {
        return tripRepository.findByUserOrderByStartDateDesc(currentUser(email));
    }

    public Trip getMine(String email, Long id) {
        return tripRepository.findByIdAndUser(id, currentUser(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
    }

    public Trip update(String email, Long id, UpdateTripRequest request) {
        Trip trip = getMine(email, id);
        if (request.name() != null) trip.setName(request.name());
        if (request.startDate() != null) trip.setStartDate(request.startDate());
        if (request.endDate() != null) trip.setEndDate(request.endDate());
        if (request.description() != null) trip.setDescription(request.description());
        validateDates(trip.getStartDate(), trip.getEndDate());
        return tripRepository.save(trip);
    }

    public void delete(String email, Long id) {
        tripRepository.delete(getMine(email, id));
    }

    public TripStop addStop(String email, Long tripId, AddStopRequest request) {
        Trip trip = getMine(email, tripId);
        City city = cityRepository.findById(request.cityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "City not found"));

        TripStop stop = new TripStop();
        stop.setTrip(trip);
        stop.setCity(city);
        stop.setStartDate(request.startDate());
        stop.setEndDate(request.endDate());
        stop.setStopOrder(request.stopOrder());
        return stopRepository.save(stop);
    }

    public void deleteStop(String email, Long tripId, Long stopId) {
        getMine(email, tripId);
        TripStop stop = stopRepository.findByIdAndTripId(stopId, tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stop not found"));
        stopRepository.delete(stop);
    }

    public StopActivity addActivity(String email, Long tripId, Long stopId, AddActivityRequest request) {
        getMine(email, tripId);
        TripStop stop = stopRepository.findByIdAndTripId(stopId, tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stop not found"));
        Activity activity = activityRepository.findById(request.activityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));

        StopActivity sa = new StopActivity();
        sa.setStop(stop);
        sa.setActivity(activity);
        sa.setActivityDate(request.activityDate());
        sa.setStartTime(request.startTime());
        sa.setEstimatedCost(request.estimatedCost() != null ? request.estimatedCost() : activity.getEstimatedCost());
        sa.setActivityOrder(request.activityOrder());
        return stopActivityRepository.save(sa);
    }

    public void deleteActivity(String email, Long tripId, Long activityInStopId) {
        getMine(email, tripId);
        StopActivity sa = stopActivityRepository.findByIdAndStopTripId(activityInStopId, tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip activity not found"));
        stopActivityRepository.delete(sa);
    }

    public Expense addExpense(String email, Long tripId, CreateExpenseRequest request) {
        Trip trip = getMine(email, tripId);
        Expense expense = new Expense();
        expense.setTrip(trip);
        expense.setType(request.type());
        expense.setAmount(request.amount());
        expense.setDescription(request.description());
        expense.setExpenseDate(request.expenseDate());
        return expenseRepository.save(expense);
    }

    public Budget saveBudget(String email, Long tripId, BudgetRequest request) {
        Trip trip = getMine(email, tripId);
        Budget budget = budgetRepository.findByTripId(tripId).orElseGet(Budget::new);
        budget.setTrip(trip);
        budget.setTotalBudget(request.totalBudget());
        budget.setTransportBudget(request.transportBudget());
        budget.setStayBudget(request.stayBudget());
        budget.setActivityBudget(request.activityBudget());
        budget.setMealBudget(request.mealBudget());
        return budgetRepository.save(budget);
    }

    public Map<String, Object> budgetSummary(String email, Long tripId) {
        Trip trip = getMine(email, tripId);
        List<Expense> expenses = expenseRepository.findByTrip(trip);
        double totalSpent = expenses.stream().mapToDouble(Expense::getAmount).sum();

        Map<ExpenseType, Double> breakdown = expenses.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        Expense::getType,
                        java.util.stream.Collectors.summingDouble(Expense::getAmount)));

        Budget budget = budgetRepository.findByTripId(tripId).orElse(null);
        double totalBudget = budget != null && budget.getTotalBudget() != null ? budget.getTotalBudget() : 0;

        return Map.of(
                "totalBudget", totalBudget,
                "totalSpent", totalSpent,
                "remaining", totalBudget - totalSpent,
                "breakdown", breakdown
        );
    }

    public void setCoverPhoto(String email, Long tripId, String url) {
        Trip trip = getMine(email, tripId);
        trip.setCoverPhotoUrl(url);
        tripRepository.save(trip);
    }

    public void setPublic(String email, Long tripId, boolean value) {
        Trip trip = getMine(email, tripId);
        trip.setPublicTrip(value);
        tripRepository.save(trip);
    }

    private void validateDates(java.time.LocalDate start, java.time.LocalDate end) {
        if (start == null || end == null || end.isBefore(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid trip dates");
        }
    }
}
