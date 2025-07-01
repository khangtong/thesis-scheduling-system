package com.example.back_end.dao;

import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.LecturerExpertise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LecturerExpertiseRepository extends JpaRepository<LecturerExpertise, Integer> {
    List<LecturerExpertise> getLecturerExpertisesByLecturer(Lecturer lecturer);
}
