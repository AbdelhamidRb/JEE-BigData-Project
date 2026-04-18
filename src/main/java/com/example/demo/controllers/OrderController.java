package com.example.demo.controllers;

import com.example.demo.entities.*;
import com.example.demo.dto.*;
import com.example.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    // 1. Créer une nouvelle commande (Client)
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, Authentication auth) {
        // Récupérer l'utilisateur connecté via son email (token JWT)
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("EN_ATTENTE");
        order.setShippingAddress(request.getShippingAddress());

        double totalAmount = 0;

        // Traiter chaque article du panier
        for (OrderItemDto itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId()).orElseThrow();

            // Vérification de sécurité finale du stock côté serveur
            if (product.getStock() < itemDto.getQuantity()) {
                return ResponseEntity.badRequest().body("Stock insuffisant pour le produit : " + product.getName());
            }

            // Déduire le stock
            product.setStock(product.getStock() - itemDto.getQuantity());
            productRepository.save(product);

            // Créer la ligne de commande
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice()); // On fige le prix actuel
            orderItem.setOrder(order);

            order.getOrderItems().add(orderItem);
            totalAmount += (product.getPrice() * itemDto.getQuantity());
        }

        order.setTotalAmount(totalAmount);
        return ResponseEntity.ok(orderRepository.save(order));
    }

    // 2. Voir l'historique de ses commandes (Client)
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(orderRepository.findByUserOrderByIdDesc(user));
    }
}