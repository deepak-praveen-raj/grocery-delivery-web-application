package com.deepak.grocery_delivery.service;

import com.deepak.grocery_delivery.dto.product.ProductRequest;
import com.deepak.grocery_delivery.dto.product.ProductResponse;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

//    List<ProductResponse> getAllProducts();

    Page<ProductResponse> getAllProducts(int page, int size, String sortBy, String direction);

    ProductResponse getProductById(Long id);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    List<ProductResponse> searchProducts(String keyword);

    Page<ProductResponse> getProductsByCategory(
            Long categoryId,
            int page,
            int size,
            String sortBy,
            String direction
    );


    Page<ProductResponse> getProductByPriceRange(

            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sortBy,
            String direction


    );

}