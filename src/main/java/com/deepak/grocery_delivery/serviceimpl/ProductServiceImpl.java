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

import java.math.BigDecimal;
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

        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));


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

    @Override
    public Page<ProductResponse> getProductsByCategory(
            Long categoryId,
            int page,
            int size,
            String sortBy,
            String direction) {

        // Verify category exists
        categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository
                .findByCategoryIdAndActiveTrue(categoryId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<ProductResponse> getProductByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, int page, int size, String sortBy, String direction) {

        if(minPrice.compareTo(maxPrice) > 0) {

            throw new RuntimeException("Price must be greater than minPrice");

        }

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();


        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository.findByPriceBetweenAndActiveTrue(minPrice,maxPrice,pageable)
                .map(this::mapToResponse);



    }

    @Override
    public Page<ProductResponse> filterProducts(
            String keyword,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sortBy,
            String direction) {

        if (minPrice != null && maxPrice != null
                && minPrice.compareTo(maxPrice) > 0) {

            throw new RuntimeException(
                    "Minimum price cannot be greater than maximum price"
            );
        }

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository.searchProducts(
                keyword,
                categoryId,
                minPrice,
                maxPrice,
                pageable
        ).map(this::mapToResponse);
    }

    @Override
    public void increaseStock(Long productId, Integer quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        product.setStockQuantity(
                product.getStockQuantity() + quantity
        );

        productRepository.save(product);
    }

    @Override
    public void decreaseStock(Long productId, Integer quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException(
                    "Insufficient stock"
            );
        }

        product.setStockQuantity(
                product.getStockQuantity() - quantity
        );

        productRepository.save(product);
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