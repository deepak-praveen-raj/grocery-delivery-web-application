package com.deepak.grocery_delivery.dto.order;

import com.deepak.grocery_delivery.entity.OrderStatus;
import com.deepak.grocery_delivery.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;

    private String orderNumber;

    private BigDecimal totalAmount;

    private OrderStatus status;

    private PaymentStatus paymentStatus;

    private String shippingAddress;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<OrderItemResponse> items;
}