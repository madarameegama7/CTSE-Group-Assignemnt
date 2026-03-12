package com.medical.payment_service.client;

import com.medical.payment_service.dto.AppointmentResponse;
import com.medical.payment_service.dto.UpdateAppointmentPaymentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@FeignClient(name = "appointment-service", url = "${appointment-service.url}")
public interface AppointmentClient {

    @GetMapping("/api/appointments/{appointmentId}")
    AppointmentResponse getAppointmentById(@PathVariable("appointmentId") UUID appointmentId);

    @PutMapping("/api/appointments/{appointmentId}/payment-status")
    void updateAppointmentPaymentStatus(
            @PathVariable("appointmentId") UUID appointmentId,
            @RequestBody UpdateAppointmentPaymentRequest request
    );
}