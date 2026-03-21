package com.medical.doctorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response from Auth Service validation endpoint
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthValidationResponse {
    private Boolean valid;
    private String userId;
    private String role;
}
