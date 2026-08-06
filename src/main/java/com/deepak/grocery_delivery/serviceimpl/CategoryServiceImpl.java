package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.dto.category.CategoryRequest;
import com.deepak.grocery_delivery.dto.category.CategoryResponse;
import com.deepak.grocery_delivery.entity.Category;
import com.deepak.grocery_delivery.repository.CategoryRepository;
import com.deepak.grocery_delivery.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {

        if(categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists");
        }


        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category savedCategory = categoryRepository.save(category);

        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setId(savedCategory.getId());
        categoryResponse.setName(savedCategory.getName());
        categoryResponse.setDescription(savedCategory.getDescription());
        categoryResponse.setImageUrl(savedCategory.getImageUrl());
        categoryResponse.setActive(savedCategory.getActive());

        return categoryResponse;


    }

    @Override
    public List<CategoryResponse> getAllCategories() {

        List<Category> categories = categoryRepository.findAllByOrderByDisplayOrderAsc();


        return categories.stream()
                .map(this::mapToResponse)
                .toList();

    }

    private CategoryResponse mapToResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .active(category.getActive())
                .displayOrder(category.getDisplayOrder())
                .build();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest category) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void deleteCategory(Long id) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
