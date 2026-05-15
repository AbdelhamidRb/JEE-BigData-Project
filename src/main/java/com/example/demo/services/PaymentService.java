package com.example.demo.services;

import com.example.demo.entities.Order;
import com.example.demo.entities.Payment;
import com.example.demo.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Transactional
    public Payment processPayment(Order order, String method, String cardNumber, String cardHolderName) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(method);
        payment.setAmount(order.getTotalAmount());
        payment.setCreatedAt(LocalDateTime.now());

        if ("CARD".equalsIgnoreCase(method)) {
            String lastFour = cardNumber != null && cardNumber.length() >= 4
                    ? cardNumber.replaceAll("\\s", "").substring(cardNumber.replaceAll("\\s", "").length() - 4)
                    : "0000";
            payment.setCardLastFour(lastFour);
            payment.setCardHolderName(cardHolderName);
            payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            payment.setStatus("COMPLETED");
        } else {
            payment.setTransactionId("CASH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            payment.setStatus("PENDING");
        }

        return paymentRepository.save(payment);
    }
}
