package com.medical.payment_service.client;

import com.medical.payment_service.dto.AppointmentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentServiceClient {

    private final WebClient webClient;

    public AppointmentResponse getAppointmentById(int appointmentId) {
        try {
            // Try to get the current HTTP request's Authorization header so we can forward the token
            String authHeader = null;
            try {
                ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attrs != null) {
                    HttpServletRequest request = attrs.getRequest();
                    authHeader = request.getHeader("Authorization");
                }
            } catch (Exception e) {
                log.debug("Could not read current request attributes: {}", e.getMessage());
            }

            WebClient.RequestHeadersSpec<?> req = webClient.get()
                    .uri("/appointments/{appointmentId}", appointmentId);

            if (authHeader != null) {
                req = req.header("Authorization", authHeader);
            }

            return req.retrieve()
                    .bodyToMono(AppointmentResponse.class)
                    .block();
        } catch (WebClientResponseException error) {
            log.error("Failed to fetch appointment: {}", error.getStatusCode());
            return null;
        } catch (Exception e) {
            log.error("Appointment fetch error: {}", e.getMessage());
            return null;
        }
    }
}
