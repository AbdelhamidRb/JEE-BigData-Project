package com.example.demo.dto.bigdata;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderEventLog {
    private Long orderId;
    private String eventType;       // "ORDER_CREATED", "ORDER_CANCELLED", etc.
    private LocalDateTime timestamp;
    private String status;
    private Double totalAmount;
    private String shippingAddress;

    // Données client (utiles pour stats géographiques)
    private Long userId;
    private String userCity;
    private String userState;

    // Produits achetés
    private List<ItemLog> items;

    @Data
    public static class ItemLog {
        private Long productId;
        private String productName;
        private String categoryName;
        private Double price;
        private Integer quantity;
    }
}