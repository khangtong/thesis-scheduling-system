package com.example.back_end.rest;

import com.example.back_end.entity.DefensePeriod;
import com.example.back_end.entity.TimeSlot;
import com.example.back_end.service.TimeSlotService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
public class TimeSlotController {
    private TimeSlotService timeSlotService;
    private AuthController authController;

    @Autowired
    public TimeSlotController(TimeSlotService timeSlotService, AuthController authController) {
        this.timeSlotService = timeSlotService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<TimeSlot>> getAllTimeSlots(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request)) || "GIANG_VIEN".equals(authController.authorize(response, request))) {
                List<TimeSlot> timeSlots = timeSlotService.getAllTimeSlots();
                return ResponseEntity.ok(timeSlots);
            } else {
                return new SendError<List<TimeSlot>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<TimeSlot>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeSlot> getTimeSlotById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                TimeSlot timeSlot = timeSlotService.getTimeSlotById(id);
                return ResponseEntity.ok(timeSlot);
            } else {
                return new SendError<TimeSlot>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<TimeSlot>().sendNotFound(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<TimeSlot> createTimeSlot(@RequestBody TimeSlot timeSlot, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                TimeSlot dbTimeSlot = timeSlotService.createTimeSlot(timeSlot);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbTimeSlot);
            } else {
                return new SendError<TimeSlot>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<TimeSlot>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeSlot> updateTimeSlotById(@PathVariable int id, @RequestBody TimeSlot timeSlot, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                TimeSlot updatedTimeSlot = timeSlotService.updateTimeSlotById(id, timeSlot);
                return ResponseEntity.ok(updatedTimeSlot);
            } else {
                return new SendError<TimeSlot>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<TimeSlot>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTimeSlotById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                timeSlotService.deleteTimeSlotById(id);
                return ResponseEntity.ok("Đã xóa khung giờ thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
