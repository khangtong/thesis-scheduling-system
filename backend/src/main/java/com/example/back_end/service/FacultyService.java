package com.example.back_end.service;

import com.example.back_end.dao.FacultyRepository;
import com.example.back_end.entity.Faculty;
import com.example.back_end.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FacultyService {
    private FacultyRepository facultyRepository;

    @Autowired
    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    @Transactional(readOnly = true)
    public List<Faculty> getAllFaculties() {
        return facultyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Faculty getFacultyById(int id) {
        Faculty faculty = facultyRepository.findById(id).orElse(null);
        if (faculty == null)
            throw new Error("Không tìm thấy khoa");
        return faculty;
    }

    @Transactional
    public Faculty createFaculty(String facultyName) {
        if ("".equals(facultyName))
            throw new Error("Tên khoa không được là rỗng");
        Faculty newFaculty = new Faculty();
        newFaculty.setName(facultyName);
        return facultyRepository.save(newFaculty);
    }

    @Transactional
    public Faculty updateFacultyById(int id, String name) {
        Faculty faculty = facultyRepository.findById(id).orElse(null);
        if (faculty == null)
            throw new Error("Không tìm thấy khoa");
        if ("".equals(name))
            throw new Error("Tên khoa không được là rỗng");
        faculty.setName(name);
        return facultyRepository.save(faculty);
    }

    @Transactional
    public void deleteFacultyById(int id) {
        Faculty faculty = facultyRepository.findById(id).orElse(null);
        if (faculty == null)
            throw new Error("Không tìm thấy khoa");
        facultyRepository.deleteById(id);
    }
}
