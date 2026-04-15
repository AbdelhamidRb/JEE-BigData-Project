package com.example.demo.services;

import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository; // Nécessaire pour chercher le rôle

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));
    }

    public User updateUserRole(Long userId, String roleName) {
        User user = findUserById(userId);

        // Récupérer l'entité Role exacte depuis la base de données
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rôle introuvable : " + roleName));

        // Remplacer les rôles existants par le nouveau (ou utiliser .add() si on veut cumuler)
        user.getRoles().clear();
        user.getRoles().add(role);

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findUserById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    public void reactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        user.setActive(true); // On réactive le compte
        userRepository.save(user);
    }
}