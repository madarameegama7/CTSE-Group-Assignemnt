package com.medical.payment_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.ArrayList;
import java.util.List;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            System.out.println("Token validation successful");
            return true;
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getClass().getName());
            System.out.println("Reason: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);

        Object roleClaim = claims.get("role");
        List<String> roles = new ArrayList<>();

        if (roleClaim instanceof String role) {
            roles.add(role);
        }

        return roles;
    }

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
}