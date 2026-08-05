package com.deepak.grocery_delivery.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterResponse {

    private String message;

    private Long userId;
}
