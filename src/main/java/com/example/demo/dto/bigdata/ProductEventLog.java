package com.example.demo.dto.bigdata;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProductEventLog {
    private Long productId;
    private String eventType;      // "PRODUCT_CREATED", "PRODUCT_UPDATED", "PRODUCT_TOGGLED"
    private LocalDateTime timestamp;

    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private boolean active;
    private String categoryName;
    private String imageUrl;
}