package com.medical.doctorservice.client;

import com.medical.doctorservice.dto.AuthValidationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

/**
 * Auth Service Client
 * Communicates with Auth Service via API Gateway
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceClient {

    private final WebClient webClient;

    @Value("${auth.service.url:http://localhost:8080/api/auth}")
    private String authServiceUrl;

    /**
     * Validate JWT token with Auth Service
     */
    public Mono<AuthValidationResponse> validateToken(String token) {
        return webClient.get()
                .uri("/auth/validate")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(AuthValidationResponse.class)
                .doOnError(error -> {
                    if (error instanceof WebClientResponseException) {
                        log.error("Auth validation failed: {}", ((WebClientResponseException) error).getStatusCode());
                    } else {
                        log.error("Auth validation error: {}", error.getMessage());
                    }
                })
                .onErrorReturn(new AuthValidationResponse(false, null, null));
    }

    /**
     * Verify user role with Auth Service
     */
    public Mono<Boolean> verifyUserRole(String userId, String requiredRole) {
        return webClient.get()
                .uri("/auth/verify-role?userId={userId}&role={role}", userId, requiredRole)
                .retrieve()
                .bodyToMono(Boolean.class)
                .doOnError(error -> log.error("Role verification failed: {}", error.getMessage()))
                .onErrorReturn(false);
    }
}
