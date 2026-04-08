package com.scamguard.backend.repository;

import com.scamguard.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}