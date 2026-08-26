package com.deepak.grocery_delivery.config;

import com.deepak.grocery_delivery.security.CustomUserDetailsService;
import com.deepak.grocery_delivery.security.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {


        // ==========================================
        // GET AUTHORIZATION HEADER
        // ==========================================

        String authHeader =
                request.getHeader("Authorization");


        // ==========================================
        // NO TOKEN
        // ==========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // EXTRACT JWT
        // ==========================================

        String jwt =
                authHeader.substring(7);


        try {

            // ======================================
            // EXTRACT USERNAME
            // ======================================

            String username =
                    jwtService.extractUsername(jwt);


            // ======================================
            // CREATE AUTHENTICATION
            // ======================================

            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {


                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        username
                                );


                // ==================================
                // VALIDATE TOKEN
                // ==================================

                if (jwtService.isTokenValid(
                        jwt,
                        userDetails
                )) {


                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );


                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );


                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );

                    System.out.println(
                            "===================================="
                    );

                    System.out.println(
                            "JWT USERNAME: " + username
                    );

                    System.out.println(
                            "REQUEST URI: " + request.getRequestURI()
                    );

                    System.out.println(
                            "AUTHORITIES: " +
                                    userDetails.getAuthorities()
                    );

                    System.out.println(
                            "TOKEN VALID: " +
                                    jwtService.isTokenValid(
                                            jwt,
                                            userDetails
                                    )
                    );

                    System.out.println(
                            "===================================="
                    );


                    System.out.println(
                            "JWT authentication successful for: "
                                    + username
                    );
                }
            }

            System.out.println(
                    "JWT REQUEST: "
                            + request.getRequestURI()
            );

            System.out.println(
                    "JWT USERNAME: "
                            + username
            );

            System.out.println(
                    "AUTHENTICATION: "
                            + SecurityContextHolder
                            .getContext()
                            .getAuthentication()
            );


        } catch (Exception exception) {

            // ======================================
            // INVALID / EXPIRED JWT
            // ======================================

            System.out.println(
                    "Invalid JWT: "
                            + exception.getMessage()
            );

            /*
             * Do NOT block the request here.
             *
             * Spring Security will decide whether
             * the endpoint requires authentication.
             */
        }


        // ==========================================
        // CONTINUE REQUEST
        // ==========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}