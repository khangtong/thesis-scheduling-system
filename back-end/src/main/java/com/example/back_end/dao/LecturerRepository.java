package com.example.back_end.dao;

import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, Integer> {
    Lecturer findByUser(User user);
}
