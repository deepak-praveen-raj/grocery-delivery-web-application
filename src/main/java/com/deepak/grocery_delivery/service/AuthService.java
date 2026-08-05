package com.deepak.grocery_delivery.service;

import com.deepak.grocery_delivery.dto.auth.LoginRequest;
import com.deepak.grocery_delivery.dto.auth.LoginResponse;
import com.deepak.grocery_delivery.dto.auth.RegisterRequest;
import com.deepak.grocery_delivery.dto.auth.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}
