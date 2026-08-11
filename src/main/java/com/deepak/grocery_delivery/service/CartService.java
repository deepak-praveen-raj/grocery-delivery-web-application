package com.deepak.grocery_delivery.service;

import com.deepak.grocery_delivery.dto.cart.AddToCartRequest;
import com.deepak.grocery_delivery.dto.cart.CartResponse;
import com.deepak.grocery_delivery.dto.cart.UpdateCartItemRequest;

public interface CartService {

    CartResponse addToCart(
            String email,
            AddToCartRequest request
    );

    CartResponse getCart(String email);

    CartResponse updateCartItem(
            String email,
            Long cartItemId,
            UpdateCartItemRequest request
    );

    void removeCartItem(
            String email,
            Long cartItemId
    );

    void clearCart(String email);
}