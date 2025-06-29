package com.example.back_end.dao;

import com.example.back_end.entity.Degree;
import com.example.back_end.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DegreeRepository extends JpaRepository<Degree, Integer> {
    @Query("SELECT d FROM Degree d WHERE d.name ILIKE %?1%")
    List<Degree> searchDegrees(String query);
}
