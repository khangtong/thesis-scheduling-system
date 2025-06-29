package com.example.back_end.rest;

import com.example.back_end.entity.Degree;
import com.example.back_end.entity.Faculty;
import com.example.back_end.service.DegreeService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/degrees")
public class DegreeController {
    private DegreeService degreeService;
    private AuthController authController;

    @Autowired
    public DegreeController(DegreeService degreeService, AuthController authController) {
        this.degreeService = degreeService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<Degree>> getAllDegrees(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Degree> degrees = degreeService.getAllDegrees();
                return ResponseEntity.ok(degrees);
            } else {
                return new SendError<List<Degree>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Degree>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Degree> getDegreeById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Degree degree = degreeService.getDegreeById(id);
                return ResponseEntity.ok(degree);
            } else {
                return new SendError<Degree>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Degree>().sendNotFound(error.getMessage(), response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Degree>> searchDegrees(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Degree> degrees = degreeService.searchDegrees(request.getParameterMap().get("query")[0]);
                return ResponseEntity.ok(degrees);
            } else {
                return new SendError<List<Degree>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Degree>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<Degree> createDegree(@RequestBody Degree degree, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Degree dbDegree = degreeService.createDegree(degree.getName());
                return ResponseEntity.status(HttpStatus.CREATED).body(dbDegree);
            } else {
                return new SendError<Degree>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Degree>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Degree> updateDegreeById(@PathVariable int id, @RequestBody Degree degree, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Degree updatedDegree = degreeService.updateDegreeById(id, degree.getName());
                return ResponseEntity.ok(updatedDegree);
            } else {
                return new SendError<Degree>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Degree>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDegreeById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                degreeService.deleteDegreeById(id);
                return ResponseEntity.ok("Đã xóa học vị thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
