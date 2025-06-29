package com.example.back_end.dao;

import com.example.back_end.entity.Faculty;
import com.example.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Integer> {
    @Query("SELECT f FROM Faculty f WHERE f.name ILIKE %?1%")
    List<Faculty> searchFaculties(String query);
}
