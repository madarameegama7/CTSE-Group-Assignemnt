package com.appoinment.appoinment.client;

import com.appoinment.appoinment.dto.SlotDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorServiceClient {

    private final WebClient webClient;

    @Value("${doctor.service.url:http://localhost:8080/api/doctors}")
    private String doctorServiceUrl;

    public Mono<SlotDTO> getSlot(Long doctorId, Long slotId) {
        return webClient.get()
                .uri("/doctors/{doctorId}/slots/{slotId}", doctorId, slotId)
                .retrieve()
                .bodyToMono(SlotDTO.class)
                .doOnError(error -> {
                    if (error instanceof WebClientResponseException) {
                        log.error("Failed to fetch slot: {}", ((WebClientResponseException) error).getStatusCode());
                    } else {
                        log.error("Slot fetch error: {}", error.getMessage());
                    }
                })
                .onErrorResume(error -> Mono.empty());
    }

    public Mono<List<SlotDTO>> getAllSlots(Long doctorId) {
        return webClient.get()
                .uri("/doctors/{doctorId}/slots", doctorId)
                .retrieve()
                .bodyToFlux(SlotDTO.class)
                .collectList()
                .doOnError(error -> log.error("Failed to fetch slots: {}", error.getMessage()))
                .onErrorReturn(Arrays.asList());
    }

    public Mono<Boolean> verifySlotAvailability(Long doctorId, Long slotId) {
        return getSlot(doctorId, slotId)
                .map(slot -> slot.getAvailable() != null && slot.getAvailable())
                .onErrorReturn(false);
    }
}
