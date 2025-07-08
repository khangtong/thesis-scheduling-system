package com.example.back_end.rest;

import com.example.back_end.dto.TimeSlotDTO;
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

import java.time.LocalDate;
import java.time.LocalTime;
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
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
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

    @GetMapping("/search")
    public ResponseEntity<List<TimeSlot>> searchTimeSlots(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request)) || "GIANG_VIEN".equals(authController.authorize(response, request))) {
                List<TimeSlot> timeSlots = timeSlotService.getAllTimeSlots();

                if (request.getParameterMap().get("date") != null) {
                    LocalDate date = LocalDate.parse(request.getParameterMap().get("date")[0]);
                    for (int i = timeSlots.size() - 1; i >= 0; i--) {
                        TimeSlot timeSlot = timeSlots.get(i);
                        if (!timeSlot.getDate().equals(date))
                            timeSlots.remove(i);

                    }
                }

                if (request.getParameterMap().get("start") != null) {
                    LocalTime start = LocalTime.parse(request.getParameterMap().get("start")[0]);
                    for (int i = timeSlots.size() - 1; i >= 0; i--) {
                        TimeSlot timeSlot = timeSlots.get(i);
                        if (!timeSlot.getStart().equals(start))
                            timeSlots.remove(i);
                    }
                }

                if (request.getParameterMap().get("end") != null) {
                    LocalTime end = LocalTime.parse(request.getParameterMap().get("end")[0]);
                    for (int i = timeSlots.size() - 1; i >= 0; i--) {
                        TimeSlot timeSlot = timeSlots.get(i);
                        if (!timeSlot.getEnd().equals(end))
                            timeSlots.remove(i);
                    }
                }

                return ResponseEntity.ok(timeSlots);
            } else {
                return new SendError<List<TimeSlot>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<TimeSlot>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<TimeSlot>> getTimeSlotsByDateRange(HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
                LocalDate startDate = LocalDate.parse(request.getParameterMap().get("startDate")[0]);
                LocalDate endDate = LocalDate.parse(request.getParameterMap().get("endDate")[0]);
                List<TimeSlot> timeSlots = timeSlotService.getTimeSlotsByDateRange(startDate, endDate);
                return ResponseEntity.ok(timeSlots);
            } else {
                return new SendError<List<TimeSlot>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<TimeSlot>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<List<TimeSlot>> createTimeSlot(@RequestBody TimeSlotDTO timeSlotDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<TimeSlot> dbTimeSlots = timeSlotService.createTimeSlot(timeSlotDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbTimeSlots);
            } else {
                return new SendError<List<TimeSlot>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<TimeSlot>>().sendBadRequest(error.getMessage(), response);
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
