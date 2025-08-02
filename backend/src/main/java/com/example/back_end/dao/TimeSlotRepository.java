package com.example.back_end.dao;

import com.example.back_end.entity.DefenseCommittee;
import com.example.back_end.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
    List<TimeSlot> findAllByOrderByIdAsc();
    List<TimeSlot> findByDate(LocalDate date);
    List<TimeSlot> findByDefenseCommittee(DefenseCommittee defenseCommittee);
    List<TimeSlot> findByDateOrderByIdAsc(LocalDate date);
}
