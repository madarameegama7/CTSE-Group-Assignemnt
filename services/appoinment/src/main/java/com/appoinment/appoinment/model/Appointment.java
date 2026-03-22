package com.appoinment.appoinment.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Long doctorId;

    @Column(nullable = false)
    private LocalDate date;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(nullable = false)
    private LocalTime time;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;
}
