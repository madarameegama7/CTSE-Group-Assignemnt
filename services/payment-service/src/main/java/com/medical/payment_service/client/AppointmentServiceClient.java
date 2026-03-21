package com.medical.payment_service.client;

import com.medical.payment_service.dto.AppointmentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentServiceClient {

    private final WebClient webClient;

    public AppointmentResponse getAppointmentById(int appointmentId) {
        try {
            return webClient.get()
                    .uri("/appointments/{appointmentId}", appointmentId)
                    .retrieve()
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
