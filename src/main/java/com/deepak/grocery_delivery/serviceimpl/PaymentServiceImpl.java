package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.dto.payment.PaymentRequest;
import com.deepak.grocery_delivery.dto.payment.PaymentResponse;
import com.deepak.grocery_delivery.dto.payment.PaymentVerificationRequest;
import com.deepak.grocery_delivery.entity.Cart;
import com.deepak.grocery_delivery.entity.CartItem;
import com.deepak.grocery_delivery.entity.Order;
import com.deepak.grocery_delivery.entity.OrderItem;
import com.deepak.grocery_delivery.entity.OrderStatus;
import com.deepak.grocery_delivery.entity.Payment;
import com.deepak.grocery_delivery.entity.PaymentStatus;
import com.deepak.grocery_delivery.entity.Product;
import com.deepak.grocery_delivery.entity.User;
import com.deepak.grocery_delivery.repository.*;
import com.deepak.grocery_delivery.service.PaymentService;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final RazorpayClient razorpayClient;
    private final CartItemRepository cartItemRepository;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;


    // =========================================================
    // CREATE PAYMENT
    // =========================================================

    @Override
    @Transactional
    public PaymentResponse createPayment(
            String email,
            PaymentRequest request) {

        // 1. Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        // 2. Find user's order
        Order order = orderRepository
                .findByIdAndUser(
                        request.getOrderId(),
                        user
                )
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));


        // 3. Payment is only allowed for PENDING orders
        if (order.getStatus() != OrderStatus.PENDING) {

            throw new RuntimeException(
                    "Payment can only be made for a pending order"
            );
        }


        // 4. Check whether payment already exists
        if (paymentRepository.existsByOrder(order)) {

            throw new RuntimeException(
                    "Payment already exists for this order"
            );
        }


        // 5. Validate order amount
        BigDecimal amount = order.getTotalAmount();

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Invalid order amount"
            );
        }


        try {

            // =================================================
            // 6. Create Razorpay Order
            // =================================================

            JSONObject razorpayOrderRequest =
                    new JSONObject();

            razorpayOrderRequest.put(
                    "amount",
                    amount
                            .multiply(BigDecimal.valueOf(100))
                            .longValue()
            );

            razorpayOrderRequest.put(
                    "currency",
                    "INR"
            );

            razorpayOrderRequest.put(
                    "receipt",
                    "ORDER_" + order.getId()
            );


            com.razorpay.Order razorpayOrder =
                    razorpayClient.orders.create(
                            razorpayOrderRequest
                    );

            System.out.println("====================================");
            System.out.println("RAZORPAY ORDER CREATED");
            System.out.println("Response: " + razorpayOrder);
            System.out.println("Order ID: " + razorpayOrder.get("id"));
            System.out.println("Amount: " + razorpayOrder.get("amount"));
            System.out.println("Currency: " + razorpayOrder.get("currency"));
            System.out.println("Status: " + razorpayOrder.get("status"));
            System.out.println("====================================");


            // =================================================
            // 7. Get Razorpay Order ID
            // =================================================

            String razorpayOrderId =
                    razorpayOrder.get("id");


            // =================================================
            // 8. Create Local Payment
            // =================================================

            Payment payment = Payment.builder()
                    .order(order)
                    .amount(amount)
                    .status(PaymentStatus.PENDING)
                    .paymentMethod(
                            request.getPaymentMethod()
                    )
                    .razorpayOrderId(
                            razorpayOrderId
                    )
                    .build();


            Payment savedPayment =
                    paymentRepository.save(payment);


            // =================================================
            // 9. Return Payment
            // =================================================

            return mapToPaymentResponse(
                    savedPayment
            );


        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to create Razorpay payment",
                    e
            );
        }
    }


    // =========================================================
    // GET PAYMENT BY ORDER ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(
            String email,
            Long orderId) {

        // 1. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        // 2. Find user's order
        Order order = orderRepository
                .findByIdAndUser(
                        orderId,
                        user
                )
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));


        // 3. Find payment
        Payment payment =
                paymentRepository
                        .findByOrder(order)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found"
                                ));


        // 4. Return payment
        return mapToPaymentResponse(payment);
    }


    // =========================================================
    // VERIFY RAZORPAY PAYMENT
    // =========================================================

    @Override
    @Transactional
    public PaymentResponse verifyPayment(
            String email,
            PaymentVerificationRequest request) {

        // 1. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        // 2. Find order
        Order order = orderRepository
                .findByIdAndUser(
                        request.getOrderId(),
                        user
                )
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));


        // 3. Find payment
        Payment payment = paymentRepository
                .findByOrder(order)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));


        // 4. Check Razorpay order ID
        if (!payment.getRazorpayOrderId()
                .equals(request.getRazorpayOrderId())) {

            throw new RuntimeException(
                    "Razorpay order ID does not match"
            );
        }


        // 5. Verify Razorpay signature
        try {

            String generatedSignature =
                    Utils.getHash(
                            request.getRazorpayOrderId()
                                    + "|" +
                                    request.getRazorpayPaymentId(),
                            razorpayKeySecret
                    );


            if (!generatedSignature.equals(
                    request.getRazorpaySignature())) {

                payment.setStatus(
                        PaymentStatus.FAILED
                );

                order.setPaymentStatus(
                        PaymentStatus.FAILED
                );

                paymentRepository.save(payment);
                orderRepository.save(order);

                throw new RuntimeException(
                        "Invalid Razorpay signature"
                );
            }


        } catch (Exception e) {

            throw new RuntimeException(
                    "Payment verification failed",
                    e
            );
        }


        // =====================================================
        // PAYMENT VERIFIED SUCCESSFULLY
        // =====================================================

        payment.setStatus(
                PaymentStatus.PAID
        );

        payment.setTransactionId(
                request.getRazorpayPaymentId()
        );


        // =====================================================
        // UPDATE ORDER
        // =====================================================

        order.setPaymentStatus(
                PaymentStatus.PAID
        );

        order.setStatus(
                OrderStatus.CONFIRMED
        );


        // =====================================================
        // REDUCE STOCK
        // =====================================================

        for (OrderItem orderItem :
                order.getItems()) {

            Product product =
                    orderItem.getProduct();


            if (!Boolean.TRUE.equals(
                    product.getActive())) {

                throw new RuntimeException(
                        "Product is no longer available: "
                                + product.getName()
                );
            }


            if (orderItem.getQuantity()
                    > product.getStockQuantity()) {

                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName()
                );
            }


            product.setStockQuantity(
                    product.getStockQuantity()
                            - orderItem.getQuantity()
            );
        }


        // =====================================================
        // CLEAR CART
        // =====================================================

        Cart cart =
                cartRepository.findByUser(user)
                        .orElse(null);

        if (cart != null) {

            cartItemRepository.deleteByCart(cart);
        }


        // =====================================================
        // SAVE
        // =====================================================

        orderRepository.save(order);

        Payment savedPayment =
                paymentRepository.save(payment);


        System.out.println(
                "Payment verified successfully"
        );

        System.out.println(
                "Payment ID: "
                        + request.getRazorpayPaymentId()
        );

        System.out.println(
                "Order ID: "
                        + order.getId()
        );

        System.out.println(
                "Order Status: "
                        + order.getStatus()
        );

        System.out.println(
                "Payment Status: "
                        + payment.getStatus()
        );


        return mapToPaymentResponse(
                savedPayment
        );
    }


    // =========================================================
    // MAP PAYMENT RESPONSE
    // =========================================================

    private PaymentResponse mapToPaymentResponse(
            Payment payment) {

        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(
                        payment.getOrder().getId()
                )
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(
                        payment.getTransactionId()
                )
                .razorpayOrderId(
                        payment.getRazorpayOrderId()
                )
                .paymentMethod(
                        payment.getPaymentMethod()
                )
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}