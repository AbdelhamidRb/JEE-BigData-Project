package com.example.demo.repositories;

import com.example.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Nécessaire pour Spring Security (login avec email)
    Optional<User> findByEmail(String email);
    User findUserById(Long id);
    Optional<User> findByUsername(String username);
}
