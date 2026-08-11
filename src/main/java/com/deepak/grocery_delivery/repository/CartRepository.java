package com.deepak.grocery_delivery.repository;

import com.deepak.grocery_delivery.entity.Cart;
import com.deepak.grocery_delivery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);

}