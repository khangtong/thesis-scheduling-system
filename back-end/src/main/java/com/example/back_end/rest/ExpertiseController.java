package com.example.back_end.rest;

import com.example.back_end.entity.Expertise;
import com.example.back_end.entity.Faculty;
import com.example.back_end.service.ExpertiseService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expertises")
public class ExpertiseController {
    private ExpertiseService expertiseService;
    private AuthController authController;

    @Autowired
    public ExpertiseController(ExpertiseService expertiseService, AuthController authController) {
        this.expertiseService = expertiseService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<Expertise>> getAllExpertises(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Expertise> expertises = expertiseService.getAllExpertises();
                return ResponseEntity.ok(expertises);
            } else {
                return new SendError<List<Expertise>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Expertise>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expertise> getExpertiseById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Expertise expertise = expertiseService.getExpertiseById(id);
                return ResponseEntity.ok(expertise);
            } else {
                return new SendError<Expertise>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Expertise>().sendNotFound(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<Expertise> createExpertise(@RequestBody Expertise expertise, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Expertise dbExpertise = expertiseService.createExpertise(expertise);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbExpertise);
            } else {
                return new SendError<Expertise>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Expertise>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expertise> updateExpertiseById(@PathVariable int id, @RequestBody Expertise expertise, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Expertise updatedExpertise = expertiseService.updateExpertiseById(id, expertise);
                return ResponseEntity.ok(updatedExpertise);
            } else {
                return new SendError<Expertise>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Expertise>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpertiseById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                expertiseService.deleteExpertiseById(id);
                return ResponseEntity.ok("Đã xóa chuyên môn thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
