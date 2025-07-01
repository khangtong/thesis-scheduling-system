package com.example.back_end.dao;

import com.example.back_end.entity.Expertise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpertiseRepository extends JpaRepository<Expertise, Integer> {
    @Query("SELECT e FROM Expertise e WHERE e.name ILIKE %?1% OR e.description ILIKE %?1%")
    List<Expertise> searchExpertises(String query);
}
