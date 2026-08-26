package com.deepak.grocery_delivery.config;

import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() throws Exception {

        System.out.println("====================================");
        System.out.println("RAZORPAY CONFIG LOADED");
        System.out.println("RAZORPAY KEY ID = " + keyId);
        System.out.println("====================================");

        return new RazorpayClient(
                keyId,
                keySecret
        );
    }
}