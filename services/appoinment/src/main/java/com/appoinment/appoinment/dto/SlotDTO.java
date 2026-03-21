package com.appoinment.appoinment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Doctor slot information from Doctor Service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotDTO {
    private Long slotId;
    private Long doctorId;
    private String date;
    private String time;
    private Boolean available;
    private String description;
}
