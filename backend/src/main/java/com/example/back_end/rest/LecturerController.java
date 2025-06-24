package com.example.back_end.rest;

import com.example.back_end.dto.LecturerDTO;
import com.example.back_end.dto.StudentDTO;
import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.Student;
import com.example.back_end.service.LecturerService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecturers")
public class LecturerController {
    private LecturerService lecturerService;
    private AuthController authController;

    @Autowired
    public LecturerController(LecturerService lecturerService, AuthController authController) {
        this.lecturerService = lecturerService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<Lecturer>> getAllLecturers(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Lecturer> lecturers = lecturerService.getAllLecturers();
                return ResponseEntity.ok(lecturers);
            } else {
                return new SendError<List<Lecturer>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Lecturer>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lecturer> getLecturerById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Lecturer lecturer = lecturerService.getLecturerById(id);
                return ResponseEntity.ok(lecturer);
            } else {
                return new SendError<Lecturer>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Lecturer>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Lecturer> getLecturerByUserId(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Lecturer lecturer = lecturerService.getLecturerByUserId(id);
                return ResponseEntity.ok(lecturer);
            } else {
                return new SendError<Lecturer>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Lecturer>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<Lecturer> createLecturer(@RequestBody LecturerDTO lecturerDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Lecturer dbLecturer = lecturerService.createLecturer(lecturerDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbLecturer);
            } else {
                return new SendError<Lecturer>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Lecturer>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lecturer> updateLecturerById(@PathVariable int id, @RequestBody LecturerDTO lecturerDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Lecturer updatedLecturer = lecturerService.updateLecturerById(id, lecturerDTO);
                return ResponseEntity.ok(updatedLecturer);
            } else {
                return new SendError<Lecturer>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Lecturer>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLecturerById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                lecturerService.deleteLecturerById(id);
                return ResponseEntity.ok("Đã xóa giảng viên thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
