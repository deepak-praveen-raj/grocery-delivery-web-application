package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.dto.payment.PaymentRequest;
import com.deepak.grocery_delivery.dto.payment.PaymentResponse;
import com.deepak.grocery_delivery.entity.*;
import com.deepak.grocery_delivery.repository.CartRepository;
import com.deepak.grocery_delivery.repository.OrderRepository;
import com.deepak.grocery_delivery.repository.PaymentRepository;
import com.deepak.grocery_delivery.repository.UserRepository;
import com.deepak.grocery_delivery.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    @Override
    @Transactional
    public PaymentResponse createPayment(
            String email,
            PaymentRequest request) {

        // 1. Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 2. Find order belonging to this user
        Order order = orderRepository
                .findByIdAndUser(request.getOrderId(), user)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        // 3. Check order status
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cannot make payment for a cancelled order");
        }

        // 4. Check existing payment
        if (paymentRepository.existsByOrder(order)) {
            throw new RuntimeException(
                    "Payment already exists for this order");
        }

        // 5. Create payment
        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .build();

        // 6. Simulate payment gateway
        boolean paymentSuccessful = true;

        if (paymentSuccessful) {

            Cart cart = cartRepository.findByUser(user)
                    .orElseThrow(() ->
                            new RuntimeException("Cart not found"));

            for (CartItem cartItem : cart.getItems()) {

                Product product = cartItem.getProduct();

                if (!Boolean.TRUE.equals(product.getActive())) {

                    throw new RuntimeException(
                            "Product is no longer available: "
                                    + product.getName());
                }

                if (cartItem.getQuantity()
                        > product.getStockQuantity()) {

                    throw new RuntimeException(
                            "Insufficient stock for product: "
                                    + product.getName());
                }

                product.setStockQuantity(
                        product.getStockQuantity()
                                - cartItem.getQuantity()
                );
            }

            payment.setStatus(PaymentStatus.PAID);

            payment.setTransactionId(
                    "TXN-" + UUID.randomUUID()
            );

            order.setPaymentStatus(
                    PaymentStatus.PAID
            );

            order.setStatus(
                    OrderStatus.CONFIRMED
            );

            cart.getItems().clear();
        } else {

            payment.setStatus(
                    PaymentStatus.FAILED
            );

            order.setPaymentStatus(
                    PaymentStatus.FAILED
            );
        }

        // 7. Save order
        orderRepository.save(order);

        // 8. Save payment
        Payment savedPayment =
                paymentRepository.save(payment);

        // 9. Return response
        return mapToPaymentResponse(savedPayment);
    }


    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(
            String email,
            Long orderId) {

        // 1. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 2. Verify order belongs to user
        Order order = orderRepository
                .findByIdAndUser(orderId, user)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        // 3. Find payment
        Payment payment = paymentRepository
                .findByOrder(order)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        // 4. Convert to response
        return mapToPaymentResponse(payment);
    }


    private PaymentResponse mapToPaymentResponse(
            Payment payment) {

        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(
                        payment.getTransactionId()
                )
                .paymentMethod(
                        payment.getPaymentMethod()
                )
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}