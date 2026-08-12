package com.deepak.grocery_delivery.service;

import com.deepak.grocery_delivery.dto.payment.PaymentRequest;
import com.deepak.grocery_delivery.dto.payment.PaymentResponse;

public interface PaymentService {

    PaymentResponse createPayment(
            String email,
            PaymentRequest request
    );

    PaymentResponse getPaymentByOrderId(
            String email,
            Long orderId
    );
}