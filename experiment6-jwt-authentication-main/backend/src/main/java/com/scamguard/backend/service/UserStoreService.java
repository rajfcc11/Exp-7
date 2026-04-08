package com.scamguard.backend.service;

import com.scamguard.backend.model.User;
import com.scamguard.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserStoreService {

    private final UserRepository userRepository;

    public UserStoreService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}