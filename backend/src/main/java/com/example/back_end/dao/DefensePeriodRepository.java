package com.example.back_end.dao;

import com.example.back_end.entity.DefensePeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DefensePeriodRepository extends JpaRepository<DefensePeriod, Integer> {
}
