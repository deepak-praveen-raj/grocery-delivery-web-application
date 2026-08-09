package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.entity.Product;
import com.deepak.grocery_delivery.repository.ProductRepository;
import com.deepak.grocery_delivery.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductRepository productRepository;

    @Override
    public String uploadProductImage(Long productId, MultipartFile file) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if (file.isEmpty()) {
            throw new RuntimeException("Image file is empty");
        }

        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        try {

            String originalFileName = file.getOriginalFilename();

            String extension = "";

            if (originalFileName != null &&
                    originalFileName.contains(".")) {

                extension = originalFileName.substring(
                        originalFileName.lastIndexOf(".")
                );
            }

            String fileName =
                    UUID.randomUUID() + extension;

            Path uploadPath =
                    Paths.get("uploads/products");

            Files.createDirectories(uploadPath);

            Path filePath =
                    uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            String imageUrl =
                    "/uploads/products/" + fileName;

            product.setImageUrl(imageUrl);

            productRepository.save(product);

            return imageUrl;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload image", e
            );
        }
    }
}