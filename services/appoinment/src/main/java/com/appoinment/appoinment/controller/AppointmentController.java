package com.appoinment.appoinment.controller;

import com.appoinment.appoinment.dto.AppointmentRequest;
import com.appoinment.appoinment.dto.StatusUpdateRequest;
import com.appoinment.appoinment.model.Appointment;
import com.appoinment.appoinment.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    /**
     * Book a new appointment
     * POST /appointments
     */
    @PostMapping
    public ResponseEntity<Appointment> bookAppointment(@Valid @RequestBody AppointmentRequest request) {
        Appointment appointment = appointmentService.bookAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }

    /**
     * View all appointments
     * GET /appointments
     */
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    /**
     * View all appointments for a patient
     * GET /appointments/patient/{id}
     */
    @GetMapping("/patient/{id}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long id) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatient(id);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Cancel an appointment (sets status to CANCELLED)
     * DELETE /appointments/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentService.cancelAppointment(id);
        return ResponseEntity.ok(appointment);
    }

    /**
     * Update appointment status (booked / cancelled / completed)
     * PUT /appointments/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        Appointment appointment = appointmentService.updateStatus(id, request);
        return ResponseEntity.ok(appointment);
    }
}

