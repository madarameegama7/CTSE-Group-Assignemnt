package com.medical.payment_service.client;

import com.medical.payment_service.dto.AppointmentResponse;
import com.medical.payment_service.dto.UpdateAppointmentPaymentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "appointment-service", url = "${appointment-service.url}")
public interface AppointmentClient {

    @GetMapping("/api/appointments/{appointmentId}")
    AppointmentResponse getAppointmentById(@PathVariable("appointmentId") int appointmentId);

    @PutMapping("/api/appointments/{appointmentId}/payment-status")
    void updateAppointmentPaymentStatus(
            @PathVariable("appointmentId") int appointmentId,
            @RequestBody UpdateAppointmentPaymentRequest request
    );
}