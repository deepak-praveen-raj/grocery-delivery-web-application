package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.dto.order.CreateOrderRequest;
import com.deepak.grocery_delivery.dto.order.OrderItemResponse;
import com.deepak.grocery_delivery.dto.order.OrderResponse;
import com.deepak.grocery_delivery.entity.Cart;
import com.deepak.grocery_delivery.entity.CartItem;
import com.deepak.grocery_delivery.entity.Order;
import com.deepak.grocery_delivery.entity.OrderItem;
import com.deepak.grocery_delivery.entity.OrderStatus;
import com.deepak.grocery_delivery.entity.PaymentStatus;
import com.deepak.grocery_delivery.entity.Product;
import com.deepak.grocery_delivery.entity.User;
import com.deepak.grocery_delivery.repository.CartRepository;
import com.deepak.grocery_delivery.repository.OrderRepository;
import com.deepak.grocery_delivery.repository.ProductRepository;
import com.deepak.grocery_delivery.repository.UserRepository;
import com.deepak.grocery_delivery.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    // =====================================================
    // CREATE ORDER
    // =====================================================

    @Override
    @Transactional
    public OrderResponse createOrder(
            String email,
            CreateOrderRequest request) {

        // 1. Find logged-in user

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        // 2. Find user's cart

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));


        // 3. Check cart is not empty

        if (cart.getItems() == null ||
                cart.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Cannot create order from an empty cart");
        }


        // 4. Check pending order

        Optional<Order> pendingOrder =
                orderRepository.findByUserAndStatus(
                        user,
                        OrderStatus.PENDING
                );

        if (pendingOrder.isPresent()) {

            throw new RuntimeException(
                    "You already have a pending order");
        }


        // 5. Validate shipping address

        if (request.getShippingAddress() == null ||
                request.getShippingAddress().isBlank()) {

            throw new RuntimeException(
                    "Shipping address is required");
        }


        // 6. Create order

        Order order = Order.builder()
                .user(user)
                .shippingAddress(
                        request.getShippingAddress()
                )
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();


        BigDecimal totalAmount = BigDecimal.ZERO;


        // 7. Convert CartItems -> OrderItems

        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();


            // Check product is active

            if (!Boolean.TRUE.equals(
                    product.getActive())) {

                throw new RuntimeException(
                        "Product is no longer available: "
                                + product.getName());
            }


            // Check stock

            if (cartItem.getQuantity()
                    > product.getStockQuantity()) {

                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName());
            }


            // Current product price

            BigDecimal unitPrice =
                    product.getPrice();


            // Calculate subtotal

            BigDecimal subtotal =
                    unitPrice.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    );


            // Create order item

            OrderItem orderItem =
                    OrderItem.builder()
                            .order(order)
                            .product(product)
                            .quantity(
                                    cartItem.getQuantity()
                            )
                            .unitPrice(unitPrice)
                            .subtotal(subtotal)
                            .build();


            order.getItems().add(orderItem);


            totalAmount =
                    totalAmount.add(subtotal);
        }


        // 8. Set final total

        order.setTotalAmount(totalAmount);


        // 9. Save order first
        //
        // This generates the database ID.

        Order savedOrder =
                orderRepository.save(order);


        // 10. Generate global customer-facing number
        //
        // Example:
        //
        // id = 13 -> ORD-00013
        // id = 14 -> ORD-00014
        // id = 15 -> ORD-00015

        String orderNumber =
                String.format(
                        "ORD-%05d",
                        savedOrder.getId()
                );


        // 11. Set order number

        savedOrder.setOrderNumber(
                orderNumber
        );


        // 12. Save again

        savedOrder =
                orderRepository.save(
                        savedOrder
                );


        // 13. Return response

        return mapToOrderResponse(
                savedOrder
        );
    }


    // =====================================================
    // MAP ORDER RESPONSE
    // =====================================================

    private OrderResponse mapToOrderResponse(
            Order order) {

        List<OrderItemResponse> items =
                order.getItems()
                        .stream()
                        .map(this::mapToOrderItemResponse)
                        .toList();


        return OrderResponse.builder()

                .id(order.getId())

                .orderNumber(
                        order.getOrderNumber()
                )

                .totalAmount(
                        order.getTotalAmount()
                )

                .status(
                        order.getStatus()
                )

                .paymentStatus(
                        order.getPaymentStatus()
                )

                .shippingAddress(
                        order.getShippingAddress()
                )

                .createdAt(
                        order.getCreatedAt()
                )

                .updatedAt(
                        order.getUpdatedAt()
                )

                .items(items)

                .build();
    }


    // =====================================================
    // MAP ORDER ITEM
    // =====================================================

    private OrderItemResponse mapToOrderItemResponse(
            OrderItem item) {

        Product product =
                item.getProduct();


        return OrderItemResponse.builder()

                .id(item.getId())

                .productId(product.getId())

                .productName(product.getName())

                .imageUrl(product.getImageUrl())

                .quantity(item.getQuantity())

                .unitPrice(item.getUnitPrice())

                .subtotal(item.getSubtotal())

                .build();
    }


    // =====================================================
    // GET ORDER BY ID
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(
            String email,
            Long orderId) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));


        Order order =
                orderRepository
                        .findByIdAndUser(
                                orderId,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"));


        return mapToOrderResponse(order);
    }


    // =====================================================
    // GET MY ORDERS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));


        List<Order> orders =
                orderRepository
                        .findByUserOrderByCreatedAtDesc(
                                user
                        );


        return orders.stream()
                .map(this::mapToOrderResponse)
                .toList();
    }


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @Override
    @Transactional
    public void cancelOrder(
            String email,
            Long orderId) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));


        Order order =
                orderRepository
                        .findByIdAndUser(
                                orderId,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"));


        if (order.getStatus()
                != OrderStatus.PENDING) {

            throw new RuntimeException(
                    "Order cannot be cancelled");
        }


        // Restore stock

        for (OrderItem orderItem :
                order.getItems()) {

            Product product =
                    orderItem.getProduct();


            product.setStockQuantity(
                    product.getStockQuantity()
                            + orderItem.getQuantity()
            );


            productRepository.save(product);
        }


        // Cancel order

        order.setStatus(
                OrderStatus.CANCELLED
        );

        orderRepository.save(order);
    }
}