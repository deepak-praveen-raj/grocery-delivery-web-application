package com.deepak.grocery_delivery.service;

import com.deepak.grocery_delivery.dto.LoginRequest;
import com.deepak.grocery_delivery.dto.LoginResponse;
import com.deepak.grocery_delivery.dto.RegisterRequest;
import com.deepak.grocery_delivery.dto.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}
