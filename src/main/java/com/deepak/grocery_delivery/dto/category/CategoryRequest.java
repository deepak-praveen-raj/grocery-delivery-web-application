package com.deepak.grocery_delivery.dto.category;

import lombok.Data;

@Data
public class CategoryRequest {

    private String name;
    private String description;
    private Integer displayOrder;

}
