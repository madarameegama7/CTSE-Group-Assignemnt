package com.medical.doctorservice.repository;

import com.medical.doctorservice.entity.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByDoctor_DoctorId(Long doctorId);
    Optional<AvailabilitySlot> findBySlotIdAndDoctor_DoctorId(Long slotId, Long doctorId);
}