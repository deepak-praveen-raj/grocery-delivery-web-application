package com.deepak.grocery_delivery.controller;

import com.deepak.grocery_delivery.dto.cart.AddToCartRequest;
import com.deepak.grocery_delivery.dto.cart.CartResponse;
import com.deepak.grocery_delivery.dto.cart.UpdateCartItemRequest;
import com.deepak.grocery_delivery.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;


    // ADD PRODUCT TO CART
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            Authentication authentication,
            @RequestBody AddToCartRequest request) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                cartService.addToCart(email, request)
        );
    }


    // GET CART
    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                cartService.getCart(email)
        );
    }


    // UPDATE CART ITEM
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @RequestBody UpdateCartItemRequest request) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                cartService.updateCartItem(
                        email,
                        cartItemId,
                        request
                )
        );
    }


    // REMOVE CART ITEM
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(
            Authentication authentication,
            @PathVariable Long cartItemId) {

        String email = authentication.getName();

        cartService.removeCartItem(
                email,
                cartItemId
        );

        return ResponseEntity.noContent().build();
    }


    // CLEAR CART
    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            Authentication authentication) {

        String email = authentication.getName();

        cartService.clearCart(email);

        return ResponseEntity.noContent().build();
    }
}