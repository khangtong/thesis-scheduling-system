package com.example.back_end.service;

import com.example.back_end.dao.ExpertiseRepository;
import com.example.back_end.entity.Expertise;
import com.example.back_end.entity.Faculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExpertiseService {
    private ExpertiseRepository expertiseRepository;

    @Autowired
    public ExpertiseService(ExpertiseRepository expertiseRepository) {
        this.expertiseRepository = expertiseRepository;
    }

    @Transactional(readOnly = true)
    public List<Expertise> getAllExpertises() {
        return expertiseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Expertise getExpertiseById(int id) {
        Expertise expertise = expertiseRepository.findById(id).orElse(null);
        if (expertise == null)
            throw new Error("Không tìm thấy chuyên môn");
        return expertise;
    }

    @Transactional
    public Expertise createExpertise(Expertise expertise) {
        Expertise newExpertise = new Expertise();

        if ("".equals(expertise.getName()))
            throw new Error("Tên chuyên môn không được là rỗng");
        newExpertise.setName(expertise.getName());

        if ("".equals(expertise.getDescription()))
            throw new Error("Mô tả chuyên môn không được là rỗng");
        newExpertise.setDescription(expertise.getDescription());

        return expertiseRepository.save(newExpertise);
    }

    @Transactional
    public Expertise updateExpertiseById(int id, Expertise expertise) {
        Expertise dbExpertise = expertiseRepository.findById(id).orElse(null);
        if (dbExpertise == null)
            throw new Error("Không tìm thấy chuyên môn");

        if ("".equals(expertise.getName()))
            throw new Error("Tên chuyên môn không được là rỗng");
        dbExpertise.setName(expertise.getName());

        if ("".equals(expertise.getDescription()))
            throw new Error("Mô tả chuyên môn không được là rỗng");
        dbExpertise.setDescription(expertise.getDescription());

        return expertiseRepository.save(dbExpertise);
    }

    @Transactional
    public void deleteExpertiseById(int id) {
        Expertise expertise = expertiseRepository.findById(id).orElse(null);
        if (expertise == null)
            throw new Error("Không tìm thấy chuyên môn");
        expertiseRepository.deleteById(id);
    }
}
