package com.example.demo.controllers;

import com.example.demo.entities.Product;
import com.example.demo.entities.Review;
import com.example.demo.entities.User;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.ReviewRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.BigDataLoggingService; // ← AJOUTER
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional; // ← AJOUTER
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BigDataLoggingService bigDataLoggingService; // ← AJOUTER

    // 1. Récupérer tous les avis d'un produit (rien ne change)
    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return ResponseEntity.ok(reviews);
    }

    // 2. Ajouter un avis
    @PostMapping("/{productId}/reviews")
    @Transactional // ← AJOUTER pour éviter LazyInitializationException
    public ResponseEntity<?> addReview(@PathVariable Long productId, @RequestBody Review reviewRequest) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (reviewRepository.existsByProductIdAndUserId(productId, user.getId())) {
            return ResponseEntity.badRequest().body("Vous avez déjà publié un avis pour ce produit.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        Review newReview = new Review();
        newReview.setRating(reviewRequest.getRating());
        newReview.setComment(reviewRequest.getComment());
        newReview.setProduct(product);
        newReview.setUser(user);

        Review savedReview = reviewRepository.save(newReview);

        // ← AJOUTER : envoi vers HDFS juste après le save
        bigDataLoggingService.sendReviewToHDFS(savedReview);

        return ResponseEntity.ok(savedReview);
    }
}