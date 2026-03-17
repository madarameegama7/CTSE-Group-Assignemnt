package com.medical.doctorservice.dto;

import lombok.Data;

@Data
public class DoctorResponse {
    public DoctorResponse() {}

    // explicit public all-args constructor to ensure visibility from other packages
    public DoctorResponse(Long doctorId, String name, String specialization, String hospital, String phone, String email) {
        this.doctorId = doctorId;
        this.name = name;
        this.specialization = specialization;
        this.hospital = hospital;
        this.phone = phone;
        this.email = email;
    }

    private Long doctorId;
    private String name;
    private String specialization;
    private String hospital;
    private String phone;
    private String email;
}