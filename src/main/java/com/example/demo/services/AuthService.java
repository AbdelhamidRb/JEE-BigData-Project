package com.example.demo.services;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // L'outil pour hasher le mot de passe

    @Transactional
    public User registerUser(RegisterRequest request) {
        // 1. Vérifier si l'email existe déjà
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Erreur : Cet email est déjà utilisé.");
        }

        // 2. Créer le nouvel utilisateur
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // Hashage du mot de passe (très important !)
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // 3. Assigner le rôle par défaut (USER)
        Optional<Role> userRole = roleRepository.findByName("USER");
        if (userRole.isPresent()) {
            user.getRoles().add(userRole.get());
        } else {
            // Si le rôle n'existe pas en base, on le crée
            Role newRole = new Role();
            newRole.setName("USER");
            roleRepository.save(newRole);
            user.getRoles().add(newRole);
        }

        // 4. Sauvegarder en base
        return userRepository.save(user);
    }
}