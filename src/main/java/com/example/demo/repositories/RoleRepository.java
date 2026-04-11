package com.example.demo.repositories;

import com.example.demo.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    // Pour attribuer un rôle spécifique lors de l'inscription
    Optional<Role> findByName(String name);
}