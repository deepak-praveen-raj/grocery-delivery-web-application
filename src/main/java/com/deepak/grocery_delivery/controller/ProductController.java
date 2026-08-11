package com.deepak.grocery_delivery.controller;

import com.deepak.grocery_delivery.dto.product.ProductRequest;
import com.deepak.grocery_delivery.dto.product.ProductResponse;
import com.deepak.grocery_delivery.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    // CREATE PRODUCT
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @RequestBody ProductRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(request));
    }


    // GET ALL PRODUCTS
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "name") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        return ResponseEntity.ok(
                productService.getAllProducts(
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }


    // GET PRODUCT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }


    // UPDATE PRODUCT
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        return ResponseEntity.ok(
                productService.updateProduct(id, request)
        );
    }


    // SOFT DELETE PRODUCT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductById(
            @PathVariable Long id) {

        productService.deleteProduct(id);

        return ResponseEntity.noContent().build();
    }


    // SEARCH PRODUCTS
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                productService.searchProducts(keyword)
        );
    }


    // GET PRODUCTS BY CATEGORY
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductResponse>> getProductsByCategory(

            @PathVariable Long categoryId,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "name") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        return ResponseEntity.ok(
                productService.getProductsByCategory(
                        categoryId,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }


    // GET PRODUCTS BY PRICE RANGE
    @GetMapping("/filter")
    public ResponseEntity<Page<ProductResponse>> getProductsByPriceRange(

            @RequestParam BigDecimal minPrice,

            @RequestParam BigDecimal maxPrice,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "name") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        return ResponseEntity.ok(
                productService.getProductByPriceRange(
                        minPrice,
                        maxPrice,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    @GetMapping("/filter-products")
    public ResponseEntity<Page<ProductResponse>> filterProducts(

            @RequestParam(required = false) String keyword,

            @RequestParam(required = false) Long categoryId,

            @RequestParam(required = false) BigDecimal minPrice,

            @RequestParam(required = false) BigDecimal maxPrice,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "name") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        return ResponseEntity.ok(
                productService.filterProducts(
                        keyword,
                        categoryId,
                        minPrice,
                        maxPrice,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    @PatchMapping("/{id}/stock/increase")
    public ResponseEntity<String> increaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        productService.increaseStock(id, quantity);

        return ResponseEntity.ok(
                "Stock increased successfully"
        );
    }

    @PatchMapping("/{id}/stock/decrease")
    public ResponseEntity<String> decreaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        productService.decreaseStock(id, quantity);

        return ResponseEntity.ok(
                "Stock decreased successfully"
        );
    }

}

