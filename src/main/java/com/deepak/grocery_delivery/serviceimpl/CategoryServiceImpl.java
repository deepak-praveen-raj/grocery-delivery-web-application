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
    public CategoryResponse createCategory(CategoryRequest category) {
        Category category1 =  new Category();


    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return List.of();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        return null;
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest category) {
        return null;
    }

    @Override
    public void deleteCategory(Long id) {

    }
}
