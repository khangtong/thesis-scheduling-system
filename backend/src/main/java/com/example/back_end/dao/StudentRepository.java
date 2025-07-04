package com.example.back_end.dao;

import com.example.back_end.entity.Student;
import com.example.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Student findByUser(User user);
}
