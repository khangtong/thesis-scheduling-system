package com.example.back_end.rest;

import com.example.back_end.entity.Faculty;
import com.example.back_end.entity.Role;
import com.example.back_end.service.FacultyService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculties")
public class FacultyController {
    private FacultyService facultyService;
    private AuthController authController;

    @Autowired
    public FacultyController(FacultyService facultyService, AuthController authController) {
        this.facultyService = facultyService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculties(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Faculty> faculties = facultyService.getAllFaculties();
                return ResponseEntity.ok(faculties);
            } else {
                return new SendError<List<Faculty>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Faculty>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getFacultyById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Faculty faculty = facultyService.getFacultyById(id);
                return ResponseEntity.ok(faculty);
            } else {
                return new SendError<Faculty>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Faculty>().sendNotFound(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<Faculty> createFaculty(@RequestBody Faculty faculty, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Faculty dbFaculty = facultyService.createFaculty(faculty.getName());
                return ResponseEntity.status(HttpStatus.CREATED).body(dbFaculty);
            } else {
                return new SendError<Faculty>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Faculty>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faculty> updateFacultyById(@PathVariable int id, @RequestBody Faculty faculty, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Faculty updatedFaculty = facultyService.updateFacultyById(id, faculty.getName());
                return ResponseEntity.ok(updatedFaculty);
            } else {
                return new SendError<Faculty>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Faculty>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFacultyById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                facultyService.deleteFacultyById(id);
                return ResponseEntity.ok("Đã xóa khoa thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
