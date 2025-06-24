package com.example.back_end.service;

import com.example.back_end.dao.StudentRepository;
import com.example.back_end.dao.UserRepository;
import com.example.back_end.dto.StudentDTO;
import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.Student;
import com.example.back_end.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudentService {
    private StudentRepository studentRepository;
    private UserRepository userRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Student getStudentById(int id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null)
            throw new Error("Không tìm thấy sinh viên");
        return student;
    }

    @Transactional(readOnly = true)
    public Student getStudentByUserId(int userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new Error("Không tìm thấy người dùng");
        Student student = studentRepository.findByUser(user);
        if (student == null)
            throw new Error("Không tìm thấy sinh viên");
        return student;
    }

    @Transactional
    public Student createStudent(StudentDTO studentDTO) {
        Student student = new Student();

        if ("".equals(studentDTO.getCode()) || studentDTO.getCode().length() != 8)
            throw new Error("Mã sinh viên không hợp lệ");
        student.setCode(studentDTO.getCode());

        if ("".equals(studentDTO.getStudentClass()))
            throw new Error("Lớp không được là rỗng");
        student.setStudentClass(studentDTO.getStudentClass());

        if (studentDTO.getUserId() != null) {
            User user = userRepository.findById(studentDTO.getUserId()).orElse(null);

            if (user == null)
                throw new Error("Không tìm thấy người dùng");

            if (!"SINH_VIEN".equals(user.getRole().getName()))
                throw new Error("Người dùng phải có vai trò sinh viên");

            student.setUser(user);
        } else {
            throw new Error("Người dùng không được là rỗng");
        }

        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());
        return studentRepository.save(student);
    }

    @Transactional
    public Student updateStudentById(int id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null)
            throw new Error("Không tìm thấy sinh viên");

        if ("".equals(studentDTO.getCode()) || studentDTO.getCode().length() != 8)
            throw new Error("Mã sinh viên không hợp lệ");
        student.setCode(studentDTO.getCode());

        if ("".equals(studentDTO.getStudentClass()))
            throw new Error("Lớp không được là rỗng");
        student.setStudentClass(studentDTO.getStudentClass());

        student.setUpdatedAt(LocalDateTime.now());
        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudentById(int id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null)
            throw new Error("Không tìm thấy sinh viên");
        studentRepository.deleteById(id);
    }
}
