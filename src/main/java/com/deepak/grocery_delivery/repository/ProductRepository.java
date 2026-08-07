package com.deepak.grocery_delivery.repository;

import com.deepak.grocery_delivery.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySku(String sku);

}