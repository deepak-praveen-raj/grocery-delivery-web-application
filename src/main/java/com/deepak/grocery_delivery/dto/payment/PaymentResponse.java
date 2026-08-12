package com.deepak.grocery_delivery.dto.payment;

import com.deepak.grocery_delivery.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;

    private Long orderId;

    private BigDecimal amount;

    private PaymentStatus status;

    private String transactionId;

    private String razorpayOrderId;

    private String paymentMethod;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}