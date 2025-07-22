package com.example.back_end.rest;

import com.example.back_end.dto.LecturerDTO;
import com.example.back_end.dto.LecturerExpertiseDTO;
import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.LecturerExpertise;
import com.example.back_end.service.LecturerExpertiseService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecturers-expertises")
public class LecturerExpertiseController {
    private LecturerExpertiseService lecturerExpertiseService;
    private AuthController authController;

    @Autowired
    public LecturerExpertiseController(LecturerExpertiseService lecturerExpertiseService, AuthController authController) {
        this.lecturerExpertiseService = lecturerExpertiseService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<LecturerExpertise>> getAllLecturerExpertises(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<LecturerExpertise> lecturerExpertises = lecturerExpertiseService.getAllLecturerExpertises();
                return ResponseEntity.ok(lecturerExpertises);
            } else {
                return new SendError<List<LecturerExpertise>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<LecturerExpertise>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<LecturerExpertise> getLecturerExpertiseById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                LecturerExpertise lecturerExpertise = lecturerExpertiseService.getLecturerExpertiseById(id);
                return ResponseEntity.ok(lecturerExpertise);
            } else {
                return new SendError<LecturerExpertise>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<LecturerExpertise>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/lecturer/{id}")
    public ResponseEntity<List<LecturerExpertise>> getLecturerExpertisesByLecturer(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
                List<LecturerExpertise> lecturerExpertises = lecturerExpertiseService.getLecturerExpertisesByLecturer(id);
                return ResponseEntity.ok(lecturerExpertises);
            } else {
                return new SendError<List<LecturerExpertise>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<LecturerExpertise>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<LecturerExpertise> createLecturerExpertise(@RequestBody LecturerExpertiseDTO lecturerExpertiseDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                LecturerExpertise dbLecturerExpertise = lecturerExpertiseService.createLecturerExpertise(lecturerExpertiseDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbLecturerExpertise);
            } else {
                return new SendError<LecturerExpertise>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<LecturerExpertise>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LecturerExpertise> updateLecturerExpertiseById(@PathVariable int id, @RequestBody LecturerExpertiseDTO lecturerExpertiseDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                LecturerExpertise updatedLecturerExpertise = lecturerExpertiseService.updateLecturerExpertiseById(id, lecturerExpertiseDTO);
                return ResponseEntity.ok(updatedLecturerExpertise);
            } else {
                return new SendError<LecturerExpertise>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<LecturerExpertise>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLecturerExpertiseById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                lecturerExpertiseService.deleteLecturerExpertiseById(id);
                return ResponseEntity.ok("Đã xóa giảng viên - chuyên môn thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
