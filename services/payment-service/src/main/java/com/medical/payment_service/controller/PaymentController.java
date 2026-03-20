package com.medical.payment_service.controller;

import com.medical.payment_service.dto.CreatePaymentRequest;
import com.medical.payment_service.dto.PaymentResponse;
import com.medical.payment_service.dto.UpdatePaymentRequest;
import com.medical.payment_service.dto.UpdatePaymentStatusRequest;
import com.medical.payment_service.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Create a payment with initial status PENDING")
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        return new ResponseEntity<>(paymentService.createPayment(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Get payment by ID")
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentById(paymentId));
    }

    @Operation(summary = "Get payments by patient ID")
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByPatientId(@PathVariable UUID patientId) {
        return ResponseEntity.ok(paymentService.getPaymentsByPatientId(patientId));
    }

    @Operation(summary = "Get payments by appointment ID")
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByAppointmentId(@PathVariable UUID appointmentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByAppointmentId(appointmentId));
    }

    @Operation(summary = "Update payment details")
    @PutMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable UUID paymentId,
            @Valid @RequestBody UpdatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.updatePayment(paymentId, request));
    }

    @Operation(summary = "Update payment status to SUCCESS or FAILED")
    @PutMapping("/{paymentId}/status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable UUID paymentId,
            @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId, request));
    }
}