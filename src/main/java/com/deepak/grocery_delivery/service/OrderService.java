package com.deepak.grocery_delivery.service;

import com.deepak.grocery_delivery.dto.order.CreateOrderRequest;
import com.deepak.grocery_delivery.dto.order.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(
            String email,
            CreateOrderRequest request
    );

    OrderResponse getOrderById(
            String email,
            Long orderId
    );

    List<OrderResponse> getMyOrders(
            String email
    );

    void cancelOrder(
            String email,
            Long orderId
    );
}