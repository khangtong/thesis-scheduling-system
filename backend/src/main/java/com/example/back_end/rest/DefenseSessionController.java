package com.example.back_end.rest;

import com.example.back_end.dto.DefenseSessionDTO;
import com.example.back_end.dto.LecturerDTO;
import com.example.back_end.entity.DefenseSession;
import com.example.back_end.entity.Lecturer;
import com.example.back_end.service.DefenseSessionService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/defense-sessions")
public class DefenseSessionController {
    private DefenseSessionService defenseSessionService;
    private AuthController authController;

    @Autowired
    public DefenseSessionController(DefenseSessionService defenseSessionService, AuthController authController) {
        this.defenseSessionService = defenseSessionService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<DefenseSession>> getAllDefenseSessions(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<DefenseSession> defenseSessions = defenseSessionService.getAllDefenseSessions();
                return ResponseEntity.ok(defenseSessions);
            } else {
                return new SendError<List<DefenseSession>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<DefenseSession>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DefenseSession> getDefenseSessionById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                DefenseSession defenseSession = defenseSessionService.getDefenseSessionById(id);
                return ResponseEntity.ok(defenseSession);
            } else {
                return new SendError<DefenseSession>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<DefenseSession>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<DefenseSession> createDefenseSession(@RequestBody DefenseSessionDTO defenseSessionDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                DefenseSession dbDefenseSession = defenseSessionService.createDefenseSession(defenseSessionDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbDefenseSession);
            } else {
                return new SendError<DefenseSession>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<DefenseSession>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DefenseSession> updateDefenseSessionById(@PathVariable int id, @RequestBody DefenseSessionDTO defenseSessionDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                DefenseSession updatedDefenseSession = defenseSessionService.updateDefenseSessionById(id, defenseSessionDTO);
                return ResponseEntity.ok(updatedDefenseSession);
            } else {
                return new SendError<DefenseSession>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<DefenseSession>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDefenseSessionById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                defenseSessionService.deleteDefenseSessionById(id);
                return ResponseEntity.ok("Đã xóa buổi bảo vệ thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
