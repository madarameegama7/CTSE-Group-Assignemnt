package com.auth.service;

import com.auth.dto.AuthRequest;
import com.auth.dto.AuthResponse;
import com.auth.dto.RegisterRequest;
import com.auth.model.User;
import com.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;


    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // ---------------- REGISTER ----------------
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Password policy
        if (!request.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
        }

        // Duplicate email check
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // Create base user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole());

        userRepository.save(user);


        // Generate JWT
        String token = jwtService.generateToken(user.getUserId(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getUserId());
    }

    // ---------------- AUTHENTICATE ----------------
    public AuthResponse authenticate(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean match = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!match) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getUserId(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name(), user.getUserId());
    }
}
