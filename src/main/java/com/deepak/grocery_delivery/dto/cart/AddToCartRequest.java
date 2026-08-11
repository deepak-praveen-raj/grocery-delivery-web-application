package com.deepak.grocery_delivery.dto.cart;

import lombok.Data;

@Data
public class AddToCartRequest {

    private Long productId;

    private Integer quantity;
}