package com.example.back_end.service;

import com.example.back_end.dao.DefenseCommitteeRepository;
import com.example.back_end.entity.CommitteeRole;
import com.example.back_end.entity.DefenseCommittee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DefenseCommitteeService {
    private DefenseCommitteeRepository defenseCommitteeRepository;

    @Autowired
    public DefenseCommitteeService(DefenseCommitteeRepository defenseCommitteeRepository) {
        this.defenseCommitteeRepository = defenseCommitteeRepository;
    }

    @Transactional(readOnly = true)
    public List<DefenseCommittee> getAllDefenseCommittees() {
        return defenseCommitteeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public DefenseCommittee getDefenseCommitteeById(int id) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");
        return defenseCommittee;
    }

    @Transactional
    public DefenseCommittee createDefenseCommittee(String name) {
        if ("".equals(name))
            throw new Error("Tên hội đồng không được là rỗng");
        DefenseCommittee defenseCommittee = new DefenseCommittee();
        defenseCommittee.setName(name);
        return defenseCommitteeRepository.save(defenseCommittee);
    }

    @Transactional
    public DefenseCommittee updateDefenseCommitteeById(int id, String name) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");
        if ("".equals(name))
            throw new Error("Tên hội đồng không được là rỗng");
        defenseCommittee.setName(name);
        return defenseCommitteeRepository.save(defenseCommittee);
    }

    @Transactional
    public void deleteDefenseCommitteeById(int id) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");
        defenseCommitteeRepository.deleteById(id);
    }
}
