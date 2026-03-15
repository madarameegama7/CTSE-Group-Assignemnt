package com.appoinment.appoinment.dto;

import com.appoinment.appoinment.model.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private AppointmentStatus status;
}

