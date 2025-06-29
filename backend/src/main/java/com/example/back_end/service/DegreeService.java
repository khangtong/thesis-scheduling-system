package com.example.back_end.service;

import com.example.back_end.dao.DegreeRepository;
import com.example.back_end.entity.Degree;
import com.example.back_end.entity.Faculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DegreeService {
    private DegreeRepository degreeRepository;

    @Autowired
    public DegreeService(DegreeRepository degreeRepository) {
        this.degreeRepository = degreeRepository;
    }

    @Transactional(readOnly = true)
    public List<Degree> getAllDegrees() {
        return degreeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Degree getDegreeById(int id) {
        Degree degree = degreeRepository.findById(id).orElse(null);
        if (degree == null)
            throw new Error("Không tìm thấy học vị");
        return degree;
    }

    @Transactional(readOnly = true)
    public List<Degree> searchDegrees(String query) {
        return degreeRepository.searchDegrees(query);
    }

    @Transactional
    public Degree createDegree(String name) {
        if ("".equals(name))
            throw new Error("Tên học vị không được là rỗng");
        Degree newDegree = new Degree();
        newDegree.setName(name);
        return degreeRepository.save(newDegree);
    }

    @Transactional
    public Degree updateDegreeById(int id, String name) {
        Degree degree = degreeRepository.findById(id).orElse(null);
        if (degree == null)
            throw new Error("Không tìm thấy học vị");
        if ("".equals(name))
            throw new Error("Tên học vị không được là rỗng");
        degree.setName(name);
        return degreeRepository.save(degree);
    }

    @Transactional
    public void deleteDegreeById(int id) {
        Degree degree = degreeRepository.findById(id).orElse(null);
        if (degree == null)
            throw new Error("Không tìm thấy học vị");
        degreeRepository.deleteById(id);
    }
}
