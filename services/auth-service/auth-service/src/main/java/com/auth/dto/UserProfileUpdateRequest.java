package com.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileUpdateRequest {
    private String name;
    private String email;
    private String phone;
    private String address;

    // Farmer fields
    private Double farmSize;
    private String farmType;
    private String location;

    // Vendor fields
    private String companyName;
    private String licenseNo;

    // Buyer fields
    private String businessName;
    private String deliveryAddress;

    // Driver fields
    private String licenseNumber;
    private String vehicleNo;
    private Boolean available;
    private String currentLocation;

    // QA fields
    private String certificationId;
    private String expertiseArea;
    private String region;
    private Integer yearsOfExperience;

    private Integer credits;   // for FARMER
    private Double rating;     // for QA
}
