package com.scamguard.backend.controller;

import com.scamguard.backend.model.User;
import com.scamguard.backend.security.JwtUtil;
import com.scamguard.backend.service.UserStoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserStoreService userStoreService;

    public AuthController(JwtUtil jwtUtil, UserStoreService userStoreService) {
        this.jwtUtil = jwtUtil;
        this.userStoreService = userStoreService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        if (user.getName() == null || user.getName().trim().isEmpty() ||
            user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {

            response.put("error", "Name, email, and password are required");
            return ResponseEntity.badRequest().body(response);
        }

        if (userStoreService.emailExists(user.getEmail())) {
            response.put("error", "User already exists");
            return ResponseEntity.status(409).body(response);
        }

        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("ROLE_USER");
        }

        userStoreService.saveUser(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        response.put("message", "Signup successful");
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Map<String, String> response = new HashMap<>();

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            response.put("error", "Email and password are required");
            return ResponseEntity.badRequest().body(response);
        }

        User existingUser = userStoreService.findByEmail(email);

        if (existingUser != null && existingUser.getPassword().equals(password)) {
            String token = jwtUtil.generateToken(existingUser.getEmail(), existingUser.getRole());

            response.put("message", "Login successful");
            response.put("token", token);
            response.put("email", existingUser.getEmail());
            response.put("name", existingUser.getName());
            response.put("role", existingUser.getRole());

            return ResponseEntity.ok(response);
        }

        response.put("error", "Invalid email or password");
        return ResponseEntity.status(401).body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Map<String, String> response = new HashMap<>();

        if (email == null || email.trim().isEmpty()) {
            response.put("error", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("message", "If this email is registered, password reset instructions will be sent.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/protected")
    public ResponseEntity<Map<String, String>> protectedRoute() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Access granted to protected route using JWT token");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful on client side. Please remove the JWT token from storage.");
        return ResponseEntity.ok(response);
    }
}