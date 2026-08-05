package com.deepak.grocery_delivery.service;

import com.deepak.grocery_delivery.dto.category.CategoryRequest;
import com.deepak.grocery_delivery.dto.category.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest category);

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse updateCategory(Long id ,CategoryRequest category);

    void deleteCategory(Long id);


}
