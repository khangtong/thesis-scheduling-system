package com.example.back_end.dao;

import com.example.back_end.entity.DefenseCommittee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DefenseCommitteeRepository extends JpaRepository<DefenseCommittee, Integer> {
}
