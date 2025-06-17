package com.example.back_end.rest;

import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.back_end.service.RoleService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    private RoleService roleService;
    private AuthController authController;

    @Autowired
    public RoleController(RoleService roleService, AuthController authController) {
        this.roleService = roleService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Role> roles = roleService.getAllRoles();
                return ResponseEntity.ok(roles);
            } else {
                return new SendError<List<Role>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Role>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Role role = roleService.getRoleById(id);
                return ResponseEntity.ok(role);
            } else {
                return new SendError<Role>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Role>().sendNotFound(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Role dbRole = roleService.createRole(role.getName());
                return ResponseEntity.status(HttpStatus.CREATED).body(dbRole);
            } else {
                return new SendError<Role>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Role>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRoleById(@PathVariable int id, @RequestBody Role role, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Role updatedRole = roleService.updateRoleById(id, role.getName());
                return ResponseEntity.ok(updatedRole);
            } else {
                return new SendError<Role>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Role>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoleById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                roleService.deleteRoleById(id);
                return ResponseEntity.ok("Đã xóa vai trò thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
