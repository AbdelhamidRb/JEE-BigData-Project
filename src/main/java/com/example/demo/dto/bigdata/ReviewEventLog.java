package com.example.demo.dto.bigdata;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewEventLog {
    private Long reviewId;
    private String eventType;        // "REVIEW_CREATED"
    private LocalDateTime timestamp;

    private Long productId;
    private String productName;
    private String categoryName;

    private Long userId;
    private String userCity;
    private String userState;

    private Integer rating;          // ← ton champ réel (1 à 5)
    private String comment;
}