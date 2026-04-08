package com.scamguard.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @GetMapping("/profile")
    public Map<String, String> profile() {
        return Map.of("message", "Welcome, authenticated user");
    }
}