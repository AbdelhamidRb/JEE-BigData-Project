package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data @NoArgsConstructor @AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    private LocalDateTime createdAt;

    // L'utilisateur qui laisse l'avis
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler","password", "roles", "orders", "email"})
    private User user;

    // Le produit concerné
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "reviews"}) // Ajoute ceci
    private Product product;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}