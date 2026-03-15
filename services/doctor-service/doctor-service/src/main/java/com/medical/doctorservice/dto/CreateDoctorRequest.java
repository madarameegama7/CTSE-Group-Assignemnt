package com.medical.doctorservice.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateDoctorRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String specialization;

    @NotBlank
    private String hospital;

    private String phone;
    private String email;

    // explicit getters and setters to avoid Lombok dependency
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getHospital() {
        return hospital;
    }

    public void setHospital(String hospital) {
        this.hospital = hospital;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}