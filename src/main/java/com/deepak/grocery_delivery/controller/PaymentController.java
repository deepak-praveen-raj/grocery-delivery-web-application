package com.deepak.grocery_delivery.controller;

import com.deepak.grocery_delivery.dto.payment.PaymentRequest;
import com.deepak.grocery_delivery.dto.payment.PaymentResponse;
import com.deepak.grocery_delivery.dto.payment.PaymentVerificationRequest;
import com.deepak.grocery_delivery.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {


    private final PaymentService paymentService;


    // =====================================================
    // CREATE PAYMENT
    // =====================================================

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            Authentication authentication,
            @Valid @RequestBody PaymentRequest request) {

        String email =
                authentication.getName();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        paymentService.createPayment(
                                email,
                                request
                        )
                );
    }


    // =====================================================
    // GET PAYMENT BY ORDER ID
    // =====================================================

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(
            Authentication authentication,
            @PathVariable Long orderId) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                paymentService.getPaymentByOrderId(
                        email,
                        orderId
                )
        );
    }


    // =====================================================
    // VERIFY RAZORPAY PAYMENT
    // =====================================================

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            Authentication authentication,
            @Valid @RequestBody
            PaymentVerificationRequest request) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                paymentService.verifyPayment(
                        email,
                        request
                )
        );
    }
}