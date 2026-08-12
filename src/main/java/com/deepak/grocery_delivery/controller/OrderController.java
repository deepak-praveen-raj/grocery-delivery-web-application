package com.deepak.grocery_delivery.controller;

import com.deepak.grocery_delivery.dto.order.CreateOrderRequest;
import com.deepak.grocery_delivery.dto.order.OrderResponse;
import com.deepak.grocery_delivery.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    // CREATE ORDER
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            Authentication authentication,
            @Valid @RequestBody CreateOrderRequest request) {

        String email = authentication.getName();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        orderService.createOrder(
                                email,
                                request
                        )
                );
    }


    // GET MY ORDERS
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                orderService.getMyOrders(email)
        );
    }


    // GET ORDER BY ID
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            Authentication authentication,
            @PathVariable Long orderId) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                orderService.getOrderById(
                        email,
                        orderId
                )
        );
    }


    // CANCEL ORDER
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(
            Authentication authentication,
            @PathVariable Long orderId) {

        String email = authentication.getName();

        orderService.cancelOrder(
                email,
                orderId
        );

        return ResponseEntity.noContent().build();
    }
}