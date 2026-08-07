package com.deepak.grocery_delivery.controller;

import com.deepak.grocery_delivery.dto.category.CategoryRequest;
import com.deepak.grocery_delivery.dto.category.CategoryResponse;
import com.deepak.grocery_delivery.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CategoryRequest request) {


        CategoryResponse categoryResponse =
                categoryService.createCategory(request);

        System.out.println(categoryResponse);

        return new ResponseEntity<>(categoryResponse, HttpStatus.CREATED);
    }

    @GetMapping("/allCategories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {

        return new ResponseEntity<>(categoryService.getAllCategories(), HttpStatus.OK);


    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {

        return new ResponseEntity<>(categoryService.getCategoryById(id), HttpStatus.OK);

    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        return new ResponseEntity<>(categoryService.updateCategory(id, request), HttpStatus.OK);
    }






}
