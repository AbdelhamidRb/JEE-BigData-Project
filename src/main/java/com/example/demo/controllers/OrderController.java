package com.example.demo.controllers;

import com.example.demo.entities.*;
import com.example.demo.dto.*;
import com.example.demo.repositories.*;
import com.example.demo.services.BigDataLoggingService; // ← AJOUTER
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional; // ← AJOUTER
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BigDataLoggingService bigDataLoggingService; // ← AJOUTER

    // 1. Créer une nouvelle commande (Client)
    @PostMapping
    @Transactional // ← AJOUTER
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("EN_ATTENTE");
        order.setShippingAddress(request.getShippingAddress());

        double totalAmount = 0;

        for (OrderItemDto itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId()).orElseThrow();

            if (product.getStock() < itemDto.getQuantity()) {
                return ResponseEntity.badRequest().body("Stock insuffisant pour le produit : " + product.getName());
            }

            product.setStock(product.getStock() - itemDto.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setOrder(order);

            order.getOrderItems().add(orderItem);
            totalAmount += (product.getPrice() * itemDto.getQuantity());
        }

        order.setTotalAmount(totalAmount);
        Order saved = orderRepository.save(order);

        bigDataLoggingService.sendOrderToHDFS(saved, "ORDER_CREATED"); // ← AJOUTER

        return ResponseEntity.ok(saved);
    }

    // 2. Voir l'historique de ses commandes (rien ne change)
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(orderRepository.findByUserOrderByIdDesc(user));
    }

    // 3. Voir toutes les commandes (rien ne change)
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    // 4. Modifier le statut (Admin)
    @PatchMapping("/admin/{id}/status")
    @Transactional // ← AJOUTER
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        order.setStatus(request.getStatus());
        Order saved = orderRepository.save(order);

        bigDataLoggingService.sendOrderToHDFS(saved, "ORDER_STATUS_UPDATED"); // ← AJOUTER

        return ResponseEntity.ok(saved);
    }
}