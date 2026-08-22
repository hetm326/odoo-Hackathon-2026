package com.globetrotter.service;

import com.globetrotter.dto.ProfileRequest;
import com.globetrotter.entity.User;
import com.globetrotter.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {
    private final UserRepository userRepository;
    private final TripService tripService;

    public ProfileService(UserRepository userRepository, TripService tripService) {
        this.userRepository = userRepository;
        this.tripService = tripService;
    }

    public User get(String email) {
        return tripService.currentUser(email);
    }

    public User update(String email, ProfileRequest request) {
        User user = get(email);
        if (request.name() != null && !request.name().isBlank()) user.setName(request.name());
        if (request.language() != null) user.setLanguage(request.language());
        if (request.email() != null && !request.email().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.email().toLowerCase())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
            }
            user.setEmail(request.email().toLowerCase());
        }
        return userRepository.save(user);
    }

    public void delete(String email) {
        userRepository.delete(get(email));
    }
}
