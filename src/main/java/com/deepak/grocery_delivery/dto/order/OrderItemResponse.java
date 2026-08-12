package com.deepak.grocery_delivery.dto.order;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long id;

    private Long productId;

    private String productName;

    private String imageUrl;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal subtotal;
}