package com.example.demo.repositories;

import com.example.demo.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Permet de récupérer les avis d'un produit, triés du plus récent au plus ancien
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    boolean existsByProductIdAndUserId(Long productId, Long userId);
}