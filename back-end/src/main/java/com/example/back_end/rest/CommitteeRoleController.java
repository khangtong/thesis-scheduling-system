package com.example.back_end.rest;

import com.example.back_end.entity.CommitteeRole;
import com.example.back_end.entity.Faculty;
import com.example.back_end.service.CommitteeRoleService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/committee-roles")
public class CommitteeRoleController {
    private CommitteeRoleService committeeRoleService;
    private AuthController authController;

    @Autowired
    public CommitteeRoleController(CommitteeRoleService committeeRoleService, AuthController authController) {
        this.committeeRoleService = committeeRoleService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<CommitteeRole>> getAllCommitteeRoles(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<CommitteeRole> committeeRoles = committeeRoleService.getAllCommitteeRoles();
                return ResponseEntity.ok(committeeRoles);
            } else {
                return new SendError<List<CommitteeRole>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<CommitteeRole>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommitteeRole> getCommitteeRoleById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                CommitteeRole committeeRole = committeeRoleService.getCommitteeRoleById(id);
                return ResponseEntity.ok(committeeRole);
            } else {
                return new SendError<CommitteeRole>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<CommitteeRole>().sendNotFound(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<CommitteeRole> createCommitteeRole(@RequestBody CommitteeRole committeeRole, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                CommitteeRole dbCommitteeRole = committeeRoleService.createCommitteeRole(committeeRole.getName());
                return ResponseEntity.status(HttpStatus.CREATED).body(dbCommitteeRole);
            } else {
                return new SendError<CommitteeRole>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<CommitteeRole>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommitteeRole> updateCommitteeRoleById(@PathVariable int id, @RequestBody CommitteeRole committeeRole, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                CommitteeRole updatedCommitteeRole = committeeRoleService.updateCommitteeRoleById(id, committeeRole.getName());
                return ResponseEntity.ok(updatedCommitteeRole);
            } else {
                return new SendError<CommitteeRole>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<CommitteeRole>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCommitteeRoleById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                committeeRoleService.deleteCommitteeRoleById(id);
                return ResponseEntity.ok("Đã xóa vai trò hội đồng thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
