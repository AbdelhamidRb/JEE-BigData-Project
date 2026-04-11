package com.example.demo.controllers;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permet au Frontend (React/Angular) de faire des requêtes sans erreur CORS
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // Route d'inscription
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerUser(registerRequest);
            return ResponseEntity.ok("Utilisateur enregistré avec succès !");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Route de connexion
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Le AuthenticationManager va automatiquement vérifier le mot de passe hashé
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Si on arrive ici, c'est que les identifiants sont corrects
        SecurityContextHolder.getContext().setAuthentication(authentication);

        /* * PROCHAINE ÉTAPE (Bonus JWT) :
         * Ici, nous devrons générer un Token JWT et le renvoyer au client
         * String jwt = jwtUtils.generateJwtToken(authentication);
         * return ResponseEntity.ok(new JwtResponse(jwt));
         */

        return ResponseEntity.ok("Connexion réussie pour : " + loginRequest.getEmail());
    }

    // Le Logout en JWT est généralement géré par le Front (en supprimant le token du LocalStorage)
}