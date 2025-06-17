package com.example.back_end.service;

import com.example.back_end.dao.RoleRepository;
import com.example.back_end.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoleService {
    private RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Role getRoleById(int id) {
        Role role = roleRepository.findById(id).orElse(null);
        if (role == null)
            throw new Error("Không tìm thấy vai trò");
        return role;
    }

    @Transactional
    public Role createRole(String roleName) {
        if ("".equals(roleName))
            throw new Error("Tên vai trò không được là rỗng");
        Role newRole = new Role();
        newRole.setName(roleName);
        return roleRepository.save(newRole);
    }

    @Transactional
    public Role updateRoleById(int id, String name) {
        Role role = roleRepository.findById(id).orElse(null);
        if (role == null)
            throw new Error("Không tìm thấy vai trò");
        if ("".equals(name))
            throw new Error("Tên vai trò không được là rỗng");
        role.setName(name);
        return roleRepository.save(role);
    }

    @Transactional
    public void deleteRoleById(int id) {
        Role role = roleRepository.findById(id).orElse(null);
        if (role == null)
            throw new Error("Không tìm thấy vai trò");
        roleRepository.deleteById(id);
    }
}
