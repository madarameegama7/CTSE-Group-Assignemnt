package com.medical.doctorservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateDoctorRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String specialization;

    @NotBlank
    private String hospital;

    private String phone;
    private String email;
}