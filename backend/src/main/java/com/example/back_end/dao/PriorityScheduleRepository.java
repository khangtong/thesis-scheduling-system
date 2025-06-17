package com.example.back_end.dao;

import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.PrioritySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriorityScheduleRepository extends JpaRepository<PrioritySchedule, Integer> {
    List<PrioritySchedule> findByLecturer(Lecturer lecturer);
}
