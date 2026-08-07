package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.dto.product.ProductRequest;
import com.deepak.grocery_delivery.dto.product.ProductResponse;
import com.deepak.grocery_delivery.entity.Category;
import com.deepak.grocery_delivery.entity.Product;
import com.deepak.grocery_delivery.repository.CategoryRepository;
import com.deepak.grocery_delivery.repository.ProductRepository;
import com.deepak.grocery_delivery.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        // Check duplicate SKU
        if (productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("SKU already exists");
        }

        // Get Category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Create Product
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .sku(request.getSku())
                .brand(request.getBrand())
                .unit(request.getUnit())
                .weight(request.getWeight())
                .category(category)
                .active(true)
                .build();

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public ProductResponse getProductById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public void deleteProduct(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    private ProductResponse mapToResponse(Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .stockQuantity(product.getStockQuantity())
                .sku(product.getSku())
                .brand(product.getBrand())
                .unit(product.getUnit())
                .weight(product.getWeight())
                .imageUrl(product.getImageUrl())
                .active(product.getActive())
                .categoryName(product.getCategory().getName())
                .build();
    }
}