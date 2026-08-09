package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.entity.Product;
import com.deepak.grocery_delivery.repository.ProductRepository;
import com.deepak.grocery_delivery.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductRepository productRepository;

    @Override
    public String uploadProductImage(Long productId, MultipartFile file) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        // Image upload logic will be added next

        return "Image upload service working";
    }
}