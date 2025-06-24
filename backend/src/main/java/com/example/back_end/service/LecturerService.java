package com.example.back_end.service;

import com.example.back_end.dao.DegreeRepository;
import com.example.back_end.dao.FacultyRepository;
import com.example.back_end.dao.LecturerRepository;
import com.example.back_end.dao.UserRepository;
import com.example.back_end.dto.LecturerDTO;
import com.example.back_end.entity.Degree;
import com.example.back_end.entity.Faculty;
import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LecturerService {
    private LecturerRepository lecturerRepository;
    private UserRepository userRepository;
    private FacultyRepository facultyRepository;
    private DegreeRepository degreeRepository;

    @Autowired
    public LecturerService(LecturerRepository lecturerRepository, UserRepository userRepository, FacultyRepository facultyRepository, DegreeRepository degreeRepository) {
        this.lecturerRepository = lecturerRepository;
        this.userRepository = userRepository;
        this.facultyRepository = facultyRepository;
        this.degreeRepository = degreeRepository;
    }

    @Transactional(readOnly = true)
    public List<Lecturer> getAllLecturers() {
        return lecturerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Lecturer getLecturerById(int id) {
        Lecturer lecturer = lecturerRepository.findById(id).orElse(null);
        if (lecturer == null)
            throw new Error("Không tìm thấy giảng viên");
        return lecturer;
    }

    @Transactional(readOnly = true)
    public Lecturer getLecturerByUserId(int userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new Error("Không tìm thấy người dùng");
        Lecturer lecturer = lecturerRepository.findByUser(user);
        if (lecturer == null)
            throw new Error("Không tìm thấy giảng viên");
        return lecturer;
    }

    @Transactional
    public Lecturer createLecturer(LecturerDTO lecturerDTO) {
        Lecturer lecturer = new Lecturer();

        if ("".equals(lecturerDTO.getCode()) || lecturerDTO.getCode().length() != 6)
            throw new Error("Mã giảng viên không hợp lệ");
        lecturer.setCode(lecturerDTO.getCode());

        if (lecturerDTO.getUserId() != null) {
            User user = userRepository.findById(lecturerDTO.getUserId()).orElse(null);

            if (user == null)
                throw new Error("Không tìm thấy người dùng");

            if (!"GIANG_VIEN".equals(user.getRole().getName()))
                throw new Error("Người dùng phải có vai trò giảng viên");

            lecturer.setUser(user);
        } else {
            throw new Error("Người dùng không được là rỗng");
        }

        if (lecturerDTO.getFacultyId() != null) {
            Faculty faculty = facultyRepository.findById(lecturerDTO.getFacultyId()).orElse(null);
            if (faculty == null)
                throw new Error("Không tìm thấy khoa");
            lecturer.setFaculty(faculty);
        } else {
            throw new Error("Khoa không được là rỗng");
        }

        if (lecturerDTO.getDegreeId() != null) {
            Degree degree = degreeRepository.findById(lecturerDTO.getDegreeId()).orElse(null);
            if (degree == null)
                throw new Error("Không tìm thấy học vị");
            lecturer.setDegree(degree);
        } else {
            throw new Error("Học vị không được là rỗng");
        }

        lecturer.setCreatedAt(LocalDateTime.now());
        lecturer.setUpdatedAt(LocalDateTime.now());
        return lecturerRepository.save(lecturer);
    }

    @Transactional
    public Lecturer updateLecturerById(int id, LecturerDTO lecturerDTO) {
        Lecturer lecturer = lecturerRepository.findById(id).orElse(null);
        if (lecturer == null)
            throw new Error("Không tìm thấy giảng viên");

        if ("".equals(lecturerDTO.getCode()) || lecturerDTO.getCode().length() != 6)
            throw new Error("Mã giảng viên không hợp lệ");
        lecturer.setCode(lecturerDTO.getCode());

        if (lecturerDTO.getFacultyId() != null) {
            Faculty faculty = facultyRepository.findById(lecturerDTO.getFacultyId()).orElse(null);
            if (faculty == null)
                throw new Error("Không tìm thấy khoa");
            lecturer.setFaculty(faculty);
        } else {
            throw new Error("Khoa không được là rỗng");
        }

        if (lecturerDTO.getDegreeId() != null) {
            Degree degree = degreeRepository.findById(lecturerDTO.getDegreeId()).orElse(null);
            if (degree == null)
                throw new Error("Không tìm thấy học vị");
            lecturer.setDegree(degree);
        } else {
            throw new Error("Học vị không được là rỗng");
        }

        lecturer.setUpdatedAt(LocalDateTime.now());
        return lecturerRepository.save(lecturer);
    }

    @Transactional
    public void deleteLecturerById(int id) {
        Lecturer lecturer = lecturerRepository.findById(id).orElse(null);
        if (lecturer == null)
            throw new Error("Không tìm thấy giảng viên");
        lecturerRepository.deleteById(id);
    }
}
