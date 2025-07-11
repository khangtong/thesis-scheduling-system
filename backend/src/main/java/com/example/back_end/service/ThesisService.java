package com.example.back_end.service;

import com.example.back_end.dao.*;
import com.example.back_end.dto.ThesisDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ThesisService {
    private ThesisRepository thesisRepository;
    private StudentRepository studentRepository;
    private LecturerRepository lecturerRepository;
    private DefenseCommitteeRepository defenseCommitteeRepository;

    @Autowired
    public ThesisService(ThesisRepository thesisRepository, StudentRepository studentRepository, LecturerRepository lecturerRepository, DefenseCommitteeRepository defenseCommitteeRepository) {
        this.thesisRepository = thesisRepository;
        this.studentRepository = studentRepository;
        this.lecturerRepository = lecturerRepository;
        this.defenseCommitteeRepository = defenseCommitteeRepository;
    }

    @Transactional(readOnly = true)
    public List<Thesis> getAllTheses(User user) {
        List<Thesis> theses = new ArrayList<>();

        if ("GIANG_VIEN".equals(user.getRole().getName())) {
            Lecturer lecturer = lecturerRepository.findByUser(user);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            theses = thesisRepository.findByLecturer(lecturer);
        } else if ("SINH_VIEN".equals(user.getRole().getName())) {
            Student student = studentRepository.findByUser(user);
            if (student == null)
                throw new Error("Không tìm thấy sinh viên");
            theses.add(thesisRepository.findByStudent(student));
        } else {
            theses = thesisRepository.findAll();
        }

        return theses;
    }

    @Transactional(readOnly = true)
    public Thesis getThesisById(int id) {
        Thesis thesis = thesisRepository.findById(id).orElse(null);
        if (thesis == null)
            throw new Error("Không tìm thấy luận văn");
        return thesis;
    }

    @Transactional
    public Thesis createThesis(ThesisDTO thesisDTO) {
        Thesis thesis = new Thesis();

        if ("".equals(thesisDTO.getTitle()))
            throw new Error("Tên đề tài luận văn không được là rỗng");
        thesis.setTitle(thesisDTO.getTitle());

        if ("".equals(thesisDTO.getStatus()))
            throw new Error("Trạng thái luận văn không được là rỗng");
        thesis.setStatus(thesisDTO.getStatus());

        if (thesisDTO.getStudentId() != null) {
            Student student = studentRepository.findById(thesisDTO.getStudentId()).orElse(null);
            if (student == null)
                throw new Error("Không tìm thấy sinh viên");
            thesis.setStudent(student);
        } else {
            throw new Error("Sinh viên không được là rỗng");
        }

        if (thesisDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(thesisDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            thesis.setLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        if (thesisDTO.getDefenseCommitteeId() != null) {
            DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(thesisDTO.getDefenseCommitteeId()).orElse(null);
            if (defenseCommittee == null)
                throw new Error("Không tìm thấy hội đồng");
            thesis.setDefenseCommittee(defenseCommittee);
        } else {
            throw new Error("Hội đồng không được là rỗng");
        }

        thesis.setCreatedAt(LocalDateTime.now());
        thesis.setUpdatedAt(LocalDateTime.now());
        return thesisRepository.save(thesis);
    }

    @Transactional
    public Thesis updateThesisById(int id, ThesisDTO thesisDTO) {
        Thesis thesis = thesisRepository.findById(id).orElse(null);
        if (thesis == null)
            throw new Error("Không tìm thấy luận văn");

        if ("".equals(thesisDTO.getTitle()))
            throw new Error("Tên đề tài luận văn không được là rỗng");
        thesis.setTitle(thesisDTO.getTitle());

        if ("".equals(thesisDTO.getStatus()))
            throw new Error("Trạng thái luận văn không được là rỗng");
        thesis.setStatus(thesisDTO.getStatus());

        if (thesisDTO.getStudentId() != null) {
            Student student = studentRepository.findById(thesisDTO.getStudentId()).orElse(null);
            if (student == null)
                throw new Error("Không tìm thấy sinh viên");
            thesis.setStudent(student);
        } else {
            throw new Error("Sinh viên không được là rỗng");
        }

        if (thesisDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(thesisDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            thesis.setLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        if (thesisDTO.getDefenseCommitteeId() != null) {
            DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(thesisDTO.getDefenseCommitteeId()).orElse(null);
            if (defenseCommittee == null)
                throw new Error("Không tìm thấy hội đồng");
            thesis.setDefenseCommittee(defenseCommittee);
        } else {
            throw new Error("Hội đồng không được là rỗng");
        }

        thesis.setUpdatedAt(LocalDateTime.now());
        return thesisRepository.save(thesis);
    }

    @Transactional
    public void deleteThesisById(int id) {
        Thesis thesis = thesisRepository.findById(id).orElse(null);
        if (thesis == null)
            throw new Error("Không tìm thấy luận văn");
        thesisRepository.deleteById(id);
    }
}
