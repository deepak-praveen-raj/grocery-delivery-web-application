package com.deepak.grocery_delivery.repository;

import com.deepak.grocery_delivery.entity.Cart;
import com.deepak.grocery_delivery.entity.CartItem;
import com.deepak.grocery_delivery.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartAndProduct(
            Cart cart,
            Product product
    );

}