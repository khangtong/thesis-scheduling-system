package com.example.back_end.rest;

import com.example.back_end.entity.DefensePeriod;
import com.example.back_end.entity.Room;
import com.example.back_end.service.DefensePeriodService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/defense-periods")
public class DefensePeriodController {
    private DefensePeriodService defensePeriodService;
    private AuthController authController;

    @Autowired
    public DefensePeriodController(DefensePeriodService defensePeriodService, AuthController authController) {
        this.defensePeriodService = defensePeriodService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<DefensePeriod>> getAllDefensePeriods(HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
                List<DefensePeriod> defensePeriods = defensePeriodService.getAllDefensePeriods();
                return ResponseEntity.ok(defensePeriods);
            } else {
                return new SendError<List<DefensePeriod>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<DefensePeriod>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DefensePeriod> getDefensePeriodById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                DefensePeriod defensePeriod = defensePeriodService.getDefensePeriodById(id);
                return ResponseEntity.ok(defensePeriod);
            } else {
                return new SendError<DefensePeriod>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<DefensePeriod>().sendNotFound(error.getMessage(), response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<DefensePeriod>> searchDefensePeriods(HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
                List<DefensePeriod> defensePeriods = defensePeriodService.getAllDefensePeriods();

                if (request.getParameterMap().get("name") != null) {
                    String name = request.getParameterMap().get("name")[0];
                    for (int i = defensePeriods.size() - 1; i >= 0; i--) {
                        DefensePeriod defensePeriod = defensePeriods.get(i);
                        if (!defensePeriod.getName().contains(name))
                            defensePeriods.remove(i);
                    }
                }

                if (request.getParameterMap().get("start") != null) {
                    LocalDateTime start = LocalDateTime.parse(request.getParameterMap().get("start")[0] + "T00:00:00");
                    for (int i = defensePeriods.size() - 1; i >= 0; i--) {
                        DefensePeriod defensePeriod = defensePeriods.get(i);
                        if (!defensePeriod.getStart().isEqual(start))
                            defensePeriods.remove(i);
                    }
                }

                if (request.getParameterMap().get("end") != null) {
                    LocalDateTime end = LocalDateTime.parse(request.getParameterMap().get("end")[0] + "T00:00:00");
                    for (int i = defensePeriods.size() - 1; i >= 0; i--) {
                        DefensePeriod defensePeriod = defensePeriods.get(i);
                        if (!defensePeriod.getEnd().isEqual(end))
                            defensePeriods.remove(i);
                    }
                }

                return ResponseEntity.ok(defensePeriods);
            } else {
                return new SendError<List<DefensePeriod>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<DefensePeriod>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<DefensePeriod> createDefensePeriod(@RequestBody DefensePeriod defensePeriod, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                DefensePeriod dbDefensePeriod = defensePeriodService.createDefensePeriod(defensePeriod);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbDefensePeriod);
            } else {
                return new SendError<DefensePeriod>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<DefensePeriod>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DefensePeriod> updateDefensePeriodById(@PathVariable int id, @RequestBody DefensePeriod defensePeriod, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                DefensePeriod updatedDefensePeriod = defensePeriodService.updateDefensePeriodById(id, defensePeriod);
                return ResponseEntity.ok(updatedDefensePeriod);
            } else {
                return new SendError<DefensePeriod>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<DefensePeriod>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDefensePeriodById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                defensePeriodService.deleteDefensePeriodById(id);
                return ResponseEntity.ok("Đã xóa đợt bảo vệ thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
