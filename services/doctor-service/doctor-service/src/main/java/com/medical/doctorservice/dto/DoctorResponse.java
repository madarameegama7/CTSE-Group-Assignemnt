package com.medical.doctorservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorResponse {
    private Long doctorId;
    private String name;
    private String specialization;
    private String hospital;
    private String phone;
    private String email;
}