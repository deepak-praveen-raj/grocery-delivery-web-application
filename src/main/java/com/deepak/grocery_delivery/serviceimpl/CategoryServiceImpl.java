package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.dto.category.CategoryRequest;
import com.deepak.grocery_delivery.dto.category.CategoryResponse;
import com.deepak.grocery_delivery.entity.Category;
import com.deepak.grocery_delivery.repository.CategoryRepository;
import com.deepak.grocery_delivery.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        Category category = categoryRepository.findById(id).orElseThrow(() ->new RuntimeException("category not found"));

        return mapToResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Long id,CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));


        if(!category.getName().equalsIgnoreCase(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists");
        }


        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setDisplayOrder(request.getDisplayOrder());

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);



    }

    @Override
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        categoryRepository.delete(category);
    }

}
