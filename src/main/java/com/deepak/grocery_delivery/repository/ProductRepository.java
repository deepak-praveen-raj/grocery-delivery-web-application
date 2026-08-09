package com.deepak.grocery_delivery.repository;

import com.deepak.grocery_delivery.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySku(String sku);

//    List<Product> findByActiveTrue();

    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);

    Page<Product> findByActiveTrue(Pageable pageable);

    Optional<Product> findByIdAndActiveTrue(Long id);

    Page<Product> findByCategoryIdAndActiveTrue(
            Long categoryId,
            Pageable pageable
    );

    Page<Product> findByPriceBetweenAndActiveTrue(

            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable

    );

    @Query("""
        SELECT p
        FROM Product p
        WHERE p.active = true
        AND (:keyword IS NULL OR
             LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR
             p.category.id = :categoryId)
        AND (:minPrice IS NULL OR
             p.price >= :minPrice)
        AND (:maxPrice IS NULL OR
             p.price <= :maxPrice)
        """)
    Page<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );



}