package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.dto.product.ProductRequest;
import com.deepak.grocery_delivery.dto.product.ProductResponse;
import com.deepak.grocery_delivery.entity.Category;
import com.deepak.grocery_delivery.entity.Product;
import com.deepak.grocery_delivery.repository.CategoryRepository;
import com.deepak.grocery_delivery.repository.ProductRepository;
import com.deepak.grocery_delivery.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public Page<ProductResponse> getAllProducts(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository
                .findByActiveTrue(pageable)
                .map(this::mapToResponse);
    }

//    @Override
//    public List<ProductResponse> getAllProducts() {
//
//        return productRepository.findByActiveTrue()
//                .stream()
//                .map(this::mapToResponse)
//                .toList();
//    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));


        return mapToResponse(product);


    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));


        if (!product.getSku().equalsIgnoreCase(request.getSku())
                && productRepository.existsBySku(request.getSku())) {

            throw new RuntimeException("SKU already exists");
        }

        // Find the new category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        // Update product fields
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setSku(request.getSku());
        product.setBrand(request.getBrand());
        product.setUnit(request.getUnit());
        product.setWeight(request.getWeight());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);

        return mapToResponse(updatedProduct);

    }

    @Override
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));


        product.setActive(false);

        productRepository.save(product);



    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {

        return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword)
                .stream()
                .map(this::mapToResponse)
                .toList();
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