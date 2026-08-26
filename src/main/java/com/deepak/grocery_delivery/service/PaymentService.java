package com.deepak.grocery_delivery.service;

import com.deepak.grocery_delivery.dto.payment.PaymentRequest;
import com.deepak.grocery_delivery.dto.payment.PaymentResponse;
import com.deepak.grocery_delivery.dto.payment.PaymentVerificationRequest;

public interface PaymentService {

    PaymentResponse createPayment(
            String email,
            PaymentRequest request
    );

    PaymentResponse getPaymentByOrderId(
            String email,
            Long orderId
    );


    PaymentResponse verifyPayment(String email,
                                  PaymentVerificationRequest request);
}