package com.example.back_end.service;

import com.example.back_end.dao.CommitteeRoleRepository;
import com.example.back_end.entity.CommitteeRole;
import com.example.back_end.entity.Faculty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommitteeRoleService {
    private CommitteeRoleRepository committeeRoleRepository;

    @Autowired
    public CommitteeRoleService(CommitteeRoleRepository committeeRoleRepository) {
        this.committeeRoleRepository = committeeRoleRepository;
    }

    @Transactional(readOnly = true)
    public List<CommitteeRole> getAllCommitteeRoles() {
        return committeeRoleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public CommitteeRole getCommitteeRoleById(int id) {
        CommitteeRole committeeRole = committeeRoleRepository.findById(id).orElse(null);
        if (committeeRole == null)
            throw new Error("Không tìm thấy vai trò hội đồng");
        return committeeRole;
    }

    @Transactional
    public CommitteeRole createCommitteeRole(String name) {
        if ("".equals(name))
            throw new Error("Tên vai trò hội đồng không được là rỗng");
        CommitteeRole newCommitteeRole = new CommitteeRole();
        newCommitteeRole.setName(name);
        return committeeRoleRepository.save(newCommitteeRole);
    }

    @Transactional
    public CommitteeRole updateCommitteeRoleById(int id, String name) {
        CommitteeRole committeeRole = committeeRoleRepository.findById(id).orElse(null);
        if (committeeRole == null)
            throw new Error("Không tìm thấy vai trò hội đồng");
        if ("".equals(name))
            throw new Error("Tên vai trò hội đồng không được là rỗng");
        committeeRole.setName(name);
        return committeeRoleRepository.save(committeeRole);
    }

    @Transactional
    public void deleteCommitteeRoleById(int id) {
        CommitteeRole committeeRole = committeeRoleRepository.findById(id).orElse(null);
        if (committeeRole == null)
            throw new Error("Không tìm thấy vai trò hội đồng");
        committeeRoleRepository.deleteById(id);
    }
}
