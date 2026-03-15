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
        Doctor doctor = new Doctor();
        doctor.setName(req.getName());
        doctor.setSpecialization(req.getSpecialization());
        doctor.setHospital(req.getHospital());
        doctor.setPhone(req.getPhone());
        doctor.setEmail(req.getEmail());

        Doctor saved = doctorRepository.save(doctor);

        DoctorResponse resp = new DoctorResponse();
        resp.setDoctorId(saved.getDoctorId());
        resp.setName(saved.getName());
        resp.setSpecialization(saved.getSpecialization());
        resp.setHospital(saved.getHospital());
        resp.setPhone(saved.getPhone());
        resp.setEmail(saved.getEmail());
        return resp;
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(d -> {
                    DoctorResponse r = new DoctorResponse();
                    r.setDoctorId(d.getDoctorId());
                    r.setName(d.getName());
                    r.setSpecialization(d.getSpecialization());
                    r.setHospital(d.getHospital());
                    r.setPhone(d.getPhone());
                    r.setEmail(d.getEmail());
                    return r;
                })
                .toList();
    }

    public SlotResponse addSlot(Long doctorId, CreateSlotRequest req) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));

        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setDoctor(doctor);
        slot.setDate(req.getDate());
        slot.setStartTime(req.getStartTime());
        slot.setEndTime(req.getEndTime());
        slot.setAvailable(true);

        AvailabilitySlot saved = slotRepository.save(slot);

        SlotResponse sr = new SlotResponse();
        sr.setSlotId(saved.getSlotId());
        sr.setDate(saved.getDate());
        sr.setStartTime(saved.getStartTime());
        sr.setEndTime(saved.getEndTime());
        sr.setAvailable(saved.getAvailable());
        return sr;
    }

    public List<SlotResponse> getDoctorSlots(Long doctorId) {
        return slotRepository.findByDoctor_DoctorId(doctorId).stream()
                .map(s -> {
                    SlotResponse r = new SlotResponse();
                    r.setSlotId(s.getSlotId());
                    r.setDate(s.getDate());
                    r.setStartTime(s.getStartTime());
                    r.setEndTime(s.getEndTime());
                    r.setAvailable(s.getAvailable());
                    return r;
                })
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