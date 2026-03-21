package com.medical.payment_service.client;

import com.medical.payment_service.dto.AppointmentResponse;
import com.medical.payment_service.dto.UpdateAppointmentPaymentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "appointment", url = "${appointment.url}")
public interface AppointmentClient {

    @GetMapping("/appointments/{appointmentId}")
    AppointmentResponse getAppointmentById(@PathVariable("appointmentId") int appointmentId);

}