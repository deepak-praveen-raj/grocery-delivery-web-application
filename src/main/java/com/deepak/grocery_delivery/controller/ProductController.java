package com.deepak.grocery_delivery.controller;

import com.deepak.grocery_delivery.dto.product.ProductRequest;
import com.deepak.grocery_delivery.dto.product.ProductResponse;
import com.deepak.grocery_delivery.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @RequestBody ProductRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(request));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );

    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {

        return new  ResponseEntity<>(productService.getProductById(id), HttpStatus.OK);


    }



}