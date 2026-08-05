package com.deepak.grocery_delivery.controller;

import com.deepak.grocery_delivery.dto.LoginRequest;
import com.deepak.grocery_delivery.dto.LoginResponse;
import com.deepak.grocery_delivery.dto.RegisterRequest;
import com.deepak.grocery_delivery.dto.RegisterResponse;
import com.deepak.grocery_delivery.entity.User;
import com.deepak.grocery_delivery.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {

        return ResponseEntity.ok(authService.register(registerRequest));

    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @GetMapping("/categories")
    public ResponseEntity<String> getCategories() {
        return new ResponseEntity<>("Categories", HttpStatus.OK);
    }




}
