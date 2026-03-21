package com.medical.doctorservice.controller;

import com.medical.doctorservice.dto.*;
import com.medical.doctorservice.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<DoctorResponse> addDoctor(@Valid @RequestBody CreateDoctorRequest req) {
        return ResponseEntity.ok(doctorService.addDoctor(req));
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PostMapping("/{doctorId}/slots")
    public ResponseEntity<SlotResponse> addSlot(@PathVariable Long doctorId,
                                                @Valid @RequestBody CreateSlotRequest req) {
        return ResponseEntity.ok(doctorService.addSlot(doctorId, req));
    }

    @GetMapping("/{doctorId}/slots")
    public ResponseEntity<List<SlotResponse>> getSlots(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorSlots(doctorId));
    }

    @GetMapping("/{doctorId}/slots/{slotId}")
    public ResponseEntity<Map<String, Object>> checkSlot(@PathVariable Long doctorId,
                                                         @PathVariable Long slotId) {
        boolean available = doctorService.isSlotAvailable(doctorId, slotId);
        return ResponseEntity.ok(Map.of("slotId", slotId, "available", available));
    }

    @PutMapping("/{doctorId}/slots/{slotId}/reserve")
    public ResponseEntity<Map<String, String>> reserve(@PathVariable Long doctorId,
                                                       @PathVariable Long slotId) {
        doctorService.markSlotUnavailable(doctorId, slotId);
        return ResponseEntity.ok(Map.of("message", "Slot reserved"));
    }
}