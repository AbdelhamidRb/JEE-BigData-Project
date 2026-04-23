package com.example.demo.controllers;

import com.example.demo.entities.Wishlist;
import com.example.demo.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Wishlist>> getWishlist(Authentication auth) {
        List<Wishlist> wishlist = wishlistService.getWishlistByUserEmail(auth.getName());
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long productId, Authentication auth) {
        try {
            Wishlist wishlist = wishlistService.addToWishlist(auth.getName(), productId);
            return ResponseEntity.ok(wishlist);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Authentication auth) {
        wishlistService.removeFromWishlist(auth.getName(), productId);
        return ResponseEntity.ok("Produit retiré de la wishlist");
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> checkInWishlist(@PathVariable Long productId, Authentication auth) {
        boolean inWishlist = wishlistService.isInWishlist(auth.getName(), productId);
        return ResponseEntity.ok(inWishlist);
    }
}