package com.deepak.grocery_delivery.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;


    // ==============================
    // GENERATE JWT
    // ==============================

    private String generateToken(
            Map<String, Object> claims,
            UserDetails userDetails) {

        System.out.println(
                "Generating JWT for: "
                        + userDetails.getUsername()
        );

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }


    // ==============================
    // GENERATE TOKEN
    // ==============================

    public String generateToken(UserDetails userDetails) {

        return generateToken(
                new HashMap<>(),
                userDetails
        );
    }


    // ==============================
    // EXTRACT USERNAME
    // ==============================

    public String extractUsername(String token) {

        String username = extractClaim(
                token,
                Claims::getSubject
        );

        System.out.println(
                "Extracted username: " + username
        );

        return username;
    }


    // ==============================
    // EXTRACT CLAIM
    // ==============================

    public <T> T extractClaim(
            String token,
            Function<Claims, T> resolver) {

        Claims claims = extractAllClaims(token);

        return resolver.apply(claims);
    }


    // ==============================
    // EXTRACT ALL CLAIMS
    // ==============================

    private Claims extractAllClaims(String token) {

        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    // ==============================
    // SIGNING KEY
    // ==============================

    private SecretKey getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(secretKey);

        return Keys.hmacShaKeyFor(keyBytes);
    }


    // ==============================
    // CHECK TOKEN EXPIRATION
    // ==============================

    private boolean isTokenExpired(String token) {

        Date expiration = extractClaim(
                token,
                Claims::getExpiration
        );

        return expiration.before(new Date());
    }


    // ==============================
    // VALIDATE TOKEN
    // ==============================

    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        final String username =
                extractUsername(token);

        return username != null
                && username.equals(
                userDetails.getUsername()
        )
                && !isTokenExpired(token);
    }
}