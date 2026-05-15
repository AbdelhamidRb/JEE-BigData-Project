package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data @NoArgsConstructor @AllArgsConstructor
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties({"orderItems", "user", "payment"})
    private Order order;

    private String method;

    private String status;

    private String transactionId;

    private Double amount;

    private String cardLastFour;

    private String cardHolderName;

    private LocalDateTime createdAt;
}
