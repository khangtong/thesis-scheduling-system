package com.example.back_end.dao;

import com.example.back_end.entity.DefenseCommittee;
import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.Student;
import com.example.back_end.entity.Thesis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThesisRepository extends JpaRepository<Thesis, Integer> {
    Thesis findByStudent(Student student);
    List<Thesis> findByLecturer(Lecturer lecturer);
    List<Thesis> findByDefenseCommittee(DefenseCommittee defenseCommittee);
}
