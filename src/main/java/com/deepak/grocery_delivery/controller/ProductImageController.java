package com.deepak.grocery_delivery.controller;

import com.deepak.grocery_delivery.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService productImageService;

    @PostMapping("/{id}/image")
    public ResponseEntity<String> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        String imageUrl =
                productImageService.uploadProductImage(id, file);

        return ResponseEntity.ok(imageUrl);
    }
}