package com.medical.doctorservice.dto;

import lombok.Data;

@Data
public class DoctorResponse {
    public DoctorResponse() {}

    public DoctorResponse(Long doctorId, String name, String specialization, String hospital, String phone, String email, Double fee) {
        this.doctorId = doctorId;
        this.name = name;
        this.specialization = specialization;
        this.hospital = hospital;
        this.phone = phone;
        this.email = email;
        this.fee = fee;
    }

    private Long doctorId;
    private String name;
    private String specialization;
    private String hospital;
    private String phone;
    private String email;
    private Double fee;
}