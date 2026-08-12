package com.deepak.grocery_delivery.repository;

import com.deepak.grocery_delivery.entity.Order;
import com.deepak.grocery_delivery.entity.Payment;
import com.deepak.grocery_delivery.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrder(Order order);

    Optional<Payment> findByTransactionId(String transactionId);

    boolean existsByOrder(Order order);

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByOrderIdAndStatus(
            Long orderId,
            PaymentStatus status
    );
}