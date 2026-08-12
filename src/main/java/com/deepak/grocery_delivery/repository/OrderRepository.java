package com.deepak.grocery_delivery.repository;

import com.deepak.grocery_delivery.entity.Order;
import com.deepak.grocery_delivery.entity.OrderStatus;
import com.deepak.grocery_delivery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByIdAndUser(Long id, User user);

    Optional<Order> findByUserAndStatus(
            User user,
            OrderStatus status
    );
}