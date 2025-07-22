package com.example.back_end.rest;

import com.example.back_end.dto.StudentDTO;
import com.example.back_end.dto.UserDTO;
import com.example.back_end.entity.Student;
import com.example.back_end.entity.User;
import com.example.back_end.service.StudentService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private StudentService studentService;
    private AuthController authController;

    @Autowired
    public StudentController(StudentService studentService, AuthController authController) {
        this.studentService = studentService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Student> students = studentService.getAllStudents();
                return ResponseEntity.ok(students);
            } else {
                return new SendError<List<Student>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Student>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Student student = studentService.getStudentById(id);
                return ResponseEntity.ok(student);
            } else {
                return new SendError<Student>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Student>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Student> getStudentByUserId(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"GIANG_VIEN".equals(authController.authorize(response, request))) {
                Student student = studentService.getStudentByUserId(id);
                return ResponseEntity.ok(student);
            } else {
                return new SendError<Student>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Student>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody StudentDTO studentDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Student dbStudent = studentService.createStudent(studentDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbStudent);
            } else {
                return new SendError<Student>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Student>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudentById(@PathVariable int id, @RequestBody StudentDTO studentDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Student updatedStudent = studentService.updateStudentById(id, studentDTO);
                return ResponseEntity.ok(updatedStudent);
            } else {
                return new SendError<Student>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Student>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudentById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                studentService.deleteStudentById(id);
                return ResponseEntity.ok("Đã xóa sinh viên thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
