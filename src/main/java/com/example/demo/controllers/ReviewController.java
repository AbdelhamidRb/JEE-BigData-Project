package com.example.demo.controllers;

import com.example.demo.entities.Product;
import com.example.demo.entities.Review;
import com.example.demo.entities.User;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.ReviewRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // À ajuster selon ta conf de sécurité
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Récupérer tous les avis d'un produit
    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return ResponseEntity.ok(reviews);
    }

    // 2. Ajouter un avis (Nécessite d'être authentifié via JWT)
    @PostMapping("/{productId}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long productId, @RequestBody Review reviewRequest) {
        // Optionnel: Gérer l'utilisateur avec Spring Security JWT
        String userEmailOrName = SecurityContextHolder.getContext().getAuthentication().getName();

// Essaie de chercher par Email (ou garde findByUsername si tu es sûr que le token contient le username)
        User user = userRepository.findByEmail(userEmailOrName)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé pour : " + userEmailOrName));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        // Création et sauvegarde de l'avis
        Review newReview = new Review();
        newReview.setRating(reviewRequest.getRating());
        newReview.setComment(reviewRequest.getComment());
        newReview.setProduct(product);
        newReview.setUser(user);

        Review savedReview = reviewRepository.save(newReview);
        return ResponseEntity.ok(savedReview);
    }
}