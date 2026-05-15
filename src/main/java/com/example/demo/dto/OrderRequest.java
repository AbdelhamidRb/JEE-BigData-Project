package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String shippingAddress;
    private List<OrderItemDto> items;
    private String paymentMethod;
    private String cardNumber;
    private String cardHolderName;
}
