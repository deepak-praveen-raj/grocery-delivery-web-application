package com.deepak.grocery_delivery.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerificationRequest {

    private Long orderId;

    private String razorpayPaymentId;

    private String razorpayOrderId;

    private String razorpaySignature;
}