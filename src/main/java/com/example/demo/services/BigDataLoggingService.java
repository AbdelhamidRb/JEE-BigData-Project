package com.example.demo.services;

import com.example.demo.dto.bigdata.OrderEventLog;
import com.example.demo.dto.bigdata.ProductEventLog;
import com.example.demo.dto.bigdata.ReviewEventLog;
import com.example.demo.entities.Order;
import com.example.demo.entities.Product;
import com.example.demo.entities.Review;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class BigDataLoggingService {

    // Ce nom doit correspondre exactement au <logger name="..."> dans logback-spring.xml
    private static final Logger bigDataLogger = LoggerFactory.getLogger("BIG_DATA_LOGGER");

    private final ObjectMapper objectMapper;

    public BigDataLoggingService() {
        this.objectMapper = new ObjectMapper();
        // Indispensable pour sérialiser LocalDateTime en texte lisible
        this.objectMapper.registerModule(new JavaTimeModule());
        // Évite que LocalDateTime soit sérialisé en tableau de nombres
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    // ─── COMMANDES ──────────────────────────────────────────────────────────────

    public void sendOrderToHDFS(Order order, String eventType) {
        try {
            OrderEventLog log = new OrderEventLog();
            log.setOrderId(order.getId());
            log.setEventType(eventType);
            log.setTimestamp(order.getOrderDate());
            log.setStatus(order.getStatus());
            log.setTotalAmount(order.getTotalAmount());
            log.setShippingAddress(order.getShippingAddress());

            if (order.getUser() != null) {
                log.setUserId(order.getUser().getId());
                log.setUserCity(order.getUser().getCity());
                log.setUserState(order.getUser().getState());
            }

            if (order.getOrderItems() != null) {
                log.setItems(order.getOrderItems().stream().map(item -> {
                    OrderEventLog.ItemLog itemLog = new OrderEventLog.ItemLog();
                    itemLog.setProductId(item.getProduct().getId());
                    itemLog.setProductName(item.getProduct().getName());
                    if (item.getProduct().getCategory() != null) {
                        itemLog.setCategoryName(item.getProduct().getCategory().getName());
                    }
                    itemLog.setPrice(item.getPrice());
                    itemLog.setQuantity(item.getQuantity());
                    return itemLog;
                }).collect(Collectors.toList()));
            }

            String jsonLine = objectMapper.writeValueAsString(log);
            bigDataLogger.info(jsonLine);

        } catch (Exception e) {
            // On ne bloque jamais la transaction principale si le log échoue
            System.err.println("[BigData] Erreur sérialisation Order #" + order.getId() + " : " + e.getMessage());
        }
    }

    // ─── REVIEWS ────────────────────────────────────────────────────────────────

    public void sendReviewToHDFS(Review review) {
        try {
            ReviewEventLog log = new ReviewEventLog();
            log.setReviewId(review.getId());
            log.setEventType("REVIEW_CREATED");
            log.setTimestamp(review.getCreatedAt());
            log.setRating(review.getRating());       // ← rating, pas score
            log.setComment(review.getComment());

            if (review.getProduct() != null) {
                log.setProductId(review.getProduct().getId());
                log.setProductName(review.getProduct().getName());
                if (review.getProduct().getCategory() != null) {
                    log.setCategoryName(review.getProduct().getCategory().getName());
                }
            }

            if (review.getUser() != null) {
                log.setUserId(review.getUser().getId());
                log.setUserCity(review.getUser().getCity());
                log.setUserState(review.getUser().getState());
            }

            String jsonLine = objectMapper.writeValueAsString(log);
            bigDataLogger.info(jsonLine);

        } catch (Exception e) {
            System.err.println("[BigData] Erreur sérialisation Review #" + review.getId() + " : " + e.getMessage());
        }
    }

    // ─── PRODUITS ────────────────────────────────────────────────────────────────

    public void sendProductToHDFS(Product product, String eventType) {
        try {
            ProductEventLog log = new ProductEventLog();
            log.setProductId(product.getId());
            log.setEventType(eventType);
            log.setTimestamp(LocalDateTime.now());
            log.setName(product.getName());
            log.setDescription(product.getDescription());
            log.setPrice(product.getPrice());
            log.setStock(product.getStock());
            log.setActive(product.isActive());
            log.setImageUrl(product.getImageUrl());

            if (product.getCategory() != null) {
                log.setCategoryName(product.getCategory().getName());
            }

            String jsonLine = objectMapper.writeValueAsString(log);
            bigDataLogger.info(jsonLine);

        } catch (Exception e) {
            System.err.println("[BigData] Erreur sérialisation Product #" + product.getId() + " : " + e.getMessage());
        }
    }
}