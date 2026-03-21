package com.medical.payment_service.repository;

import com.medical.payment_service.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByPatientId(int patientId);
    List<Payment> findByAppointmentId(int appointmentId);
}