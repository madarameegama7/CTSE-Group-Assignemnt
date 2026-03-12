package com.medical.payment_service.repository;

import com.medical.payment_service.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByPatientId(UUID patientId);
    List<Payment> findByAppointmentId(UUID appointmentId);
}