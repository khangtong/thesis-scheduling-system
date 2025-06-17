package com.example.back_end.dao;

import com.example.back_end.entity.LecturerExpertise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerExpertiseRepository extends JpaRepository<LecturerExpertise, Integer> {
}
