package com.example.demo.controllers;

import com.example.demo.entities.Product;
import com.example.demo.repositories.CategoryRepository;
import com.example.demo.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // R - Lire (Modifié : Admin voit tout, les autres voient seulement les actifs)
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(Authentication authentication) {
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        if (isAdmin) {
            return ResponseEntity.ok(productRepository.findAll());
        } else {
            return ResponseEntity.ok(productRepository.findByIsActiveTrue());
        }
    }

    // R - Lire (Admin : tous les produits, y compris inactifs)
    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Product>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // C - Créer
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            categoryRepository.findById(product.getCategory().getId()).ifPresent(product::setCategory);
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    // U - Mettre à jour (Modifié : Ajout de la mise à jour de isActive)
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(p -> {
            p.setName(productDetails.getName());
            p.setDescription(productDetails.getDescription());
            p.setPrice(productDetails.getPrice());
            p.setStock(productDetails.getStock());

            // Mise à jour du statut Actif/Inactif
            p.setActive(productDetails.isActive());

            if (productDetails.getCategory() != null) {
                categoryRepository.findById(productDetails.getCategory().getId()).ifPresent(p::setCategory);
            }
            return ResponseEntity.ok(productRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    // D - Supprimer (Conservé : Suppression physique définitive en base)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}