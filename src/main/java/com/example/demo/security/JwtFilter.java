package com.example.demo.security;

import com.example.demo.services.UserDetailsServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String email = null;
        String token = null;

        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                email = jwtUtil.extractEmail(token);
                System.out.println("[JWT] Email extracted: " + email);
            } else {
                System.out.println("[JWT] No Authorization header found for: " + request.getRequestURI());
            }
        } catch (ExpiredJwtException e) {
            System.out.println("Erreur : Le token JWT a expiré.");
        } catch (Exception e) {
            System.out.println("Erreur : Token JWT invalide: " + e.getMessage());
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                System.out.println("[JWT] User loaded: " + userDetails.getUsername());

                if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {

                    // ← Extraire le rôle directement du token
                    String role = jwtUtil.extractRole(token);
                    System.out.println("[JWT] Role extracted: " + role);
                    var authorities = java.util.List.of(
                            new org.springframework.security.core.authority.SimpleGrantedAuthority(role)
                    );

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    authorities  // ← utilise les authorities du token
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("[JWT] Authentication set for: " + email + " with role: " + role);
                } else {
                    System.out.println("[JWT] Token invalid for email: " + email);
                }
            } catch (Exception e) {
                System.out.println("[JWT] Error loading user: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}