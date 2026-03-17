package com.medical.payment_service.service;

import com.medical.payment_service.client.AppointmentClient;
import com.medical.payment_service.dto.AppointmentResponse;
import com.medical.payment_service.dto.CreatePaymentRequest;
import com.medical.payment_service.dto.PaymentResponse;
import com.medical.payment_service.dto.UpdateAppointmentPaymentRequest;
import com.medical.payment_service.entity.Payment;
import com.medical.payment_service.entity.PaymentStatus;
import com.medical.payment_service.exception.PaymentNotFoundException;
import com.medical.payment_service.exception.ResourceNotFoundException;
import com.medical.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AppointmentClient appointmentClient;

    public PaymentResponse createPayment(CreatePaymentRequest request) {
        AppointmentResponse appointment;

        try {
            appointment = appointmentClient.getAppointmentById(request.getAppointmentId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Appointment not found in Appointment Service");
        }

        if (appointment == null) {
            throw new ResourceNotFoundException("Appointment not found");
        }

        Payment payment = Payment.builder()
                .appointmentId(request.getAppointmentId())
                .patientId(request.getPatientId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.SUCCESS)
                .paymentDate(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        appointmentClient.updateAppointmentPaymentStatus(
                request.getAppointmentId(),
                new UpdateAppointmentPaymentRequest("PAID")
        );

        return mapToResponse(savedPayment);
    }

    public PaymentResponse getPaymentById(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + paymentId));

        return mapToResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByPatientId(UUID patientId) {
        return paymentRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<PaymentResponse> getPaymentsByAppointmentId(UUID appointmentId) {
        return paymentRepository.findByAppointmentId(appointmentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .appointmentId(payment.getAppointmentId())
                .patientId(payment.getPatientId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}