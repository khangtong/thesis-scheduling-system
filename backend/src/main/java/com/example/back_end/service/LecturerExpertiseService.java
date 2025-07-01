package com.example.back_end.service;

import com.example.back_end.dao.ExpertiseRepository;
import com.example.back_end.dao.LecturerExpertiseRepository;
import com.example.back_end.dao.LecturerRepository;
import com.example.back_end.dto.LecturerExpertiseDTO;
import com.example.back_end.entity.Expertise;
import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.LecturerExpertise;
import com.example.back_end.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LecturerExpertiseService {
    private LecturerExpertiseRepository lecturerExpertiseRepository;
    private LecturerRepository lecturerRepository;
    private ExpertiseRepository expertiseRepository;

    @Autowired
    public LecturerExpertiseService(LecturerExpertiseRepository lecturerExpertiseRepository, LecturerRepository lecturerRepository, ExpertiseRepository expertiseRepository) {
        this.lecturerExpertiseRepository = lecturerExpertiseRepository;
        this.lecturerRepository = lecturerRepository;
        this.expertiseRepository = expertiseRepository;
    }

    @Transactional(readOnly = true)
    public List<LecturerExpertise> getAllLecturerExpertises() {
        return lecturerExpertiseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public LecturerExpertise getLecturerExpertiseById(int id) {
        LecturerExpertise lecturerExpertise = lecturerExpertiseRepository.findById(id).orElse(null);
        if (lecturerExpertise == null)
            throw new Error("Không tìm thấy giảng viên - chuyên môn");
        return lecturerExpertise;
    }

    @Transactional(readOnly = true)
    public List<LecturerExpertise> getLecturerExpertisesByLecturer(int id) {
        Lecturer lecturer = lecturerRepository.findById(id).orElse(null);
        if (lecturer == null)
            throw new Error("Không tìm thấy giảng viên");
        return lecturerExpertiseRepository.getLecturerExpertisesByLecturer(lecturer);
    }

    @Transactional
    public LecturerExpertise createLecturerExpertise(LecturerExpertiseDTO lecturerExpertiseDTO) {
        LecturerExpertise newLecturerExpertise = new LecturerExpertise();

        if (lecturerExpertiseDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(lecturerExpertiseDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            newLecturerExpertise.setLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        if (lecturerExpertiseDTO.getExpertiseId() != null) {
            Expertise expertise = expertiseRepository.findById(lecturerExpertiseDTO.getExpertiseId()).orElse(null);
            if (expertise == null)
                throw new Error("Không tìm thấy chuyên môn");
            newLecturerExpertise.setExpertise(expertise);
        } else {
            throw new Error("Chuyên môn không được là rỗng");
        }

        return lecturerExpertiseRepository.save(newLecturerExpertise);
    }

    @Transactional
    public LecturerExpertise updateLecturerExpertiseById(int id, LecturerExpertiseDTO lecturerExpertiseDTO) {
        LecturerExpertise lecturerExpertise = lecturerExpertiseRepository.findById(id).orElse(null);
        if (lecturerExpertise == null)
            throw new Error("Không tìm thấy giảng viên - chuyên môn");

        if (lecturerExpertiseDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(lecturerExpertiseDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            lecturerExpertise.setLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        if (lecturerExpertiseDTO.getExpertiseId() != null) {
            Expertise expertise = expertiseRepository.findById(lecturerExpertiseDTO.getExpertiseId()).orElse(null);
            if (expertise == null)
                throw new Error("Không tìm thấy chuyên môn");
            lecturerExpertise.setExpertise(expertise);
        } else {
            throw new Error("Chuyên môn không được là rỗng");
        }

        return lecturerExpertiseRepository.save(lecturerExpertise);
    }

    @Transactional
    public void deleteLecturerExpertiseById(int id) {
        LecturerExpertise lecturerExpertise = lecturerExpertiseRepository.findById(id).orElse(null);
        if (lecturerExpertise == null)
            throw new Error("Không tìm thấy giảng viên - chuyên môn");
        lecturerExpertiseRepository.deleteById(id);
    }
}
