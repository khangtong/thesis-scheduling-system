package com.example.back_end.dao;

import com.example.back_end.entity.DefenseSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DefenseSessionRepository extends JpaRepository<DefenseSession, Integer> {
}
