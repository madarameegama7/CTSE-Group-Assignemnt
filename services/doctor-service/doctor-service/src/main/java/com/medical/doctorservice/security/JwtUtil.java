package com.medical.doctorservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Long extractUserId(String token) {
        Claims claims = parseClaims(token);
        Long userId = claims.get("userId", Long.class);
        if (userId != null) return userId;
        return Long.parseLong(claims.getSubject());
    }

    public String extractRoleIfExists(String token) {
        Claims claims = parseClaims(token);
        Object role = claims.get("role");
        return role == null ? null : role.toString();
    }
}