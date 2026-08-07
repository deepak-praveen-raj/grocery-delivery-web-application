package com.deepak.grocery_delivery.dto.product;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private BigDecimal discountPrice;

    private Integer stockQuantity;

    private String sku;

    private String brand;

    private String unit;

    private Double weight;

    private String imageUrl;

    private Boolean active;

    private String categoryName;

}