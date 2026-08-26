package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.dto.auth.LoginRequest;
import com.deepak.grocery_delivery.dto.auth.LoginResponse;
import com.deepak.grocery_delivery.dto.auth.RegisterRequest;
import com.deepak.grocery_delivery.dto.auth.RegisterResponse;
import com.deepak.grocery_delivery.entity.Role;
import com.deepak.grocery_delivery.entity.User;
import com.deepak.grocery_delivery.repository.UserRepository;
import com.deepak.grocery_delivery.security.JwtService;
import com.deepak.grocery_delivery.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;


    @Override
    public RegisterResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();

        userRepository.save(user);

        return RegisterResponse.builder()
                .message("Registration Successful")
                .userId(user.getId())
                .build();

    }

    @Override
    public LoginResponse login(LoginRequest request) {

       authenticationManager.authenticate(
               new UsernamePasswordAuthenticationToken(
                       request.getEmail(),
                       request.getPassword()


               )
       );

       User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found") );

        System.out.println(user.getFirstName());


       String token = jwtService.generateToken(user);

       return LoginResponse.builder()
               .token(token)
               .message("Login Successful")
               .build();



    }
}
