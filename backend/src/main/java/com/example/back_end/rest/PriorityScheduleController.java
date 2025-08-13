package com.example.back_end.rest;

import com.example.back_end.dto.PriorityScheduleDTO;
import com.example.back_end.entity.Degree;
import com.example.back_end.entity.PrioritySchedule;
import com.example.back_end.entity.User;
import com.example.back_end.service.PriorityScheduleService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/priority-schedules")
public class PriorityScheduleController {
    private PriorityScheduleService priorityScheduleService;
    private AuthController authController;

    @Autowired
    public PriorityScheduleController(PriorityScheduleService priorityScheduleService, AuthController authController) {
        this.priorityScheduleService = priorityScheduleService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<PrioritySchedule>> getAllPrioritySchedules(HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
                User user = authController.authenticate(response, request);
                List<PrioritySchedule> prioritySchedules = priorityScheduleService.getAllPrioritySchedules(user);
                return ResponseEntity.ok(prioritySchedules);
            } else {
                return new SendError<List<PrioritySchedule>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<PrioritySchedule>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrioritySchedule> getPriorityScheduleById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                PrioritySchedule prioritySchedule = priorityScheduleService.getPriorityScheduleById(id);
                return ResponseEntity.ok(prioritySchedule);
            } else {
                return new SendError<PrioritySchedule>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<PrioritySchedule>().sendNotFound(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<PrioritySchedule> createPrioritySchedule(@RequestBody PriorityScheduleDTO priorityScheduleDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
                User user = authController.authenticate(response, request);
                PrioritySchedule dbPrioritySchedule = priorityScheduleService.createPrioritySchedule(user, priorityScheduleDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbPrioritySchedule);
            } else {
                return new SendError<PrioritySchedule>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<PrioritySchedule>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrioritySchedule> updatePriorityScheduleById(@PathVariable int id, @RequestBody PriorityScheduleDTO priorityScheduleDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                PrioritySchedule updatedPrioritySchedule = priorityScheduleService.updatePriorityScheduleById(id, priorityScheduleDTO);
                return ResponseEntity.ok(updatedPrioritySchedule);
            } else {
                return new SendError<PrioritySchedule>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<PrioritySchedule>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePriorityScheduleById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                priorityScheduleService.deletePriorityScheduleById(id);
                return ResponseEntity.ok("Đã xóa lịch ưu tiên thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deletePrioritySchedule(HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
                User user = authController.authenticate(response, request);
                priorityScheduleService.deletePrioritySchedule(user, Integer.parseInt(request.getParameterMap().get("timeSlotId")[0]));
                return ResponseEntity.ok("Đã xóa lịch ưu tiên thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
