package com.example.back_end.dao;

import com.example.back_end.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThesisRepository extends JpaRepository<Thesis, Integer> {
    Thesis findByStudent(Student student);
    List<Thesis> findByLecturer(Lecturer lecturer);
    Thesis findByTimeSlot(TimeSlot timeSlot);
    List<Thesis> findByStatus(String status);
}
