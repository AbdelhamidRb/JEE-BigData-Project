package com.example.demo.controllers;

import com.example.demo.entities.*;
import com.example.demo.dto.*;
import com.example.demo.repositories.*;
import com.example.demo.services.BigDataLoggingService;
import com.example.demo.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BigDataLoggingService bigDataLoggingService;
    @Autowired private PaymentService paymentService;

    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
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

        String method = request.getPaymentMethod();
        if ("CARD".equalsIgnoreCase(method)) {
            order.setStatus("CONFIRMEE");
        } else {
            order.setStatus("EN_ATTENTE");
        }

        Order saved = orderRepository.save(order);

        Payment payment = paymentService.processPayment(saved, method, request.getCardNumber(), request.getCardHolderName());

        bigDataLoggingService.sendOrderToHDFS(saved, "ORDER_CREATED");

        Map<String, Object> response = new HashMap<>();
        response.put("order", saved);
        response.put("payment", payment);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(orderRepository.findByUserOrderByIdDesc(user));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PatchMapping("/admin/{id}/status")
    @Transactional
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        order.setStatus(request.getStatus());
        Order saved = orderRepository.save(order);

        bigDataLoggingService.sendOrderToHDFS(saved, "ORDER_STATUS_UPDATED");

        return ResponseEntity.ok(saved);
    }
}
