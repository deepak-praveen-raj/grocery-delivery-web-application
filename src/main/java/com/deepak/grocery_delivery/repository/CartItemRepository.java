package com.deepak.grocery_delivery.repository;

import com.deepak.grocery_delivery.entity.Cart;
import com.deepak.grocery_delivery.entity.CartItem;
import com.deepak.grocery_delivery.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartAndProduct(
            Cart cart,
            Product product
    );

    List<CartItem> findByCart(Cart cart);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.cart = :cart")
    void deleteByCart(@Param("cart") Cart cart);
}