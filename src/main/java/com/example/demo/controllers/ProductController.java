package com.example.demo.controllers;

import com.example.demo.entities.Product;
import com.example.demo.repositories.CategoryRepository;
import com.example.demo.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private final String UPLOAD_DIR = "uploads/";

    // Méthode utilitaire pour sauvegarder l'image
    private String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Génère un nom unique pour éviter les conflits
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return "http://localhost:9090/uploads/" + fileName; // URL complète pour React
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(Authentication authentication) {
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
        return ResponseEntity.ok(isAdmin ? productRepository.findAll() : productRepository.findByIsActiveTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Product>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // CREATE AVEC IMAGE
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createProduct(
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            if (product.getCategory() != null && product.getCategory().getId() != null) {
                categoryRepository.findById(product.getCategory().getId()).ifPresent(product::setCategory);
            }

            String imageUrl = saveImage(image);
            if (imageUrl != null) product.setImageUrl(imageUrl);

            return ResponseEntity.ok(productRepository.save(product));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la sauvegarde de l'image");
        }
    }

    // UPDATE AVEC IMAGE
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") Product productDetails,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        return productRepository.findById(id).map(p -> {
            try {
                p.setName(productDetails.getName());
                p.setDescription(productDetails.getDescription());
                p.setPrice(productDetails.getPrice());
                p.setStock(productDetails.getStock());
                p.setActive(productDetails.isActive());

                if (productDetails.getCategory() != null) {
                    categoryRepository.findById(productDetails.getCategory().getId()).ifPresent(p::setCategory);
                }

                String imageUrl = saveImage(image);
                if (imageUrl != null) {
                    p.setImageUrl(imageUrl); // Met à jour l'image seulement si une nouvelle est envoyée
                }

                return ResponseEntity.ok(productRepository.save(p));
            } catch (IOException e) {
                return ResponseEntity.internalServerError().build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleProductStatus(@PathVariable Long id) {
        Optional<Product> opt = productRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Product product = opt.get();
        boolean current = product.isActive();
        product.setActive(!current);
        return ResponseEntity.ok(productRepository.save(product));
    }
}