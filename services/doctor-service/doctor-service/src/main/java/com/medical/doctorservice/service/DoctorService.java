package com.medical.doctorservice.service;

import com.medical.doctorservice.dto.*;
import com.medical.doctorservice.entity.AvailabilitySlot;
import com.medical.doctorservice.entity.Doctor;
import com.medical.doctorservice.repository.AvailabilitySlotRepository;
import com.medical.doctorservice.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AvailabilitySlotRepository slotRepository;

    public DoctorResponse addDoctor(CreateDoctorRequest req) {
        Doctor doctor = Doctor.builder()
                .name(req.getName())
                .specialization(req.getSpecialization())
                .hospital(req.getHospital())
                .phone(req.getPhone())
                .email(req.getEmail())
                .build();

        Doctor saved = doctorRepository.save(doctor);

        return DoctorResponse.builder()
                .doctorId(saved.getDoctorId())
                .name(saved.getName())
                .specialization(saved.getSpecialization())
                .hospital(saved.getHospital())
                .phone(saved.getPhone())
                .email(saved.getEmail())
                .build();
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(d -> DoctorResponse.builder()
                        .doctorId(d.getDoctorId())
                        .name(d.getName())
                        .specialization(d.getSpecialization())
                        .hospital(d.getHospital())
                        .phone(d.getPhone())
                        .email(d.getEmail())
                        .build())
                .toList();
    }

    public SlotResponse addSlot(Long doctorId, CreateSlotRequest req) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));

        AvailabilitySlot slot = AvailabilitySlot.builder()
                .doctor(doctor)
                .date(req.getDate())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .available(true)
                .build();

        AvailabilitySlot saved = slotRepository.save(slot);

        return SlotResponse.builder()
                .slotId(saved.getSlotId())
                .date(saved.getDate())
                .startTime(saved.getStartTime())
                .endTime(saved.getEndTime())
                .available(saved.getAvailable())
                .build();
    }

    public List<SlotResponse> getDoctorSlots(Long doctorId) {
        return slotRepository.findByDoctor_DoctorId(doctorId).stream()
                .map(s -> SlotResponse.builder()
                        .slotId(s.getSlotId())
                        .date(s.getDate())
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .available(s.getAvailable())
                        .build())
                .toList();
    }

    public boolean isSlotAvailable(Long doctorId, Long slotId) {
        AvailabilitySlot slot = slotRepository.findBySlotIdAndDoctor_DoctorId(slotId, doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));
        return Boolean.TRUE.equals(slot.getAvailable());
    }

    public void markSlotUnavailable(Long doctorId, Long slotId) {
        AvailabilitySlot slot = slotRepository.findBySlotIdAndDoctor_DoctorId(slotId, doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));

        slot.setAvailable(false);
        slotRepository.save(slot);
    }
}