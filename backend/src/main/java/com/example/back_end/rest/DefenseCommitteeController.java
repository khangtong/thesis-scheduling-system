package com.example.back_end.rest;

import com.example.back_end.dto.DefenseCommitteeDTO;
import com.example.back_end.entity.CommitteeRole;
import com.example.back_end.entity.DefenseCommittee;
import com.example.back_end.entity.Faculty;
import com.example.back_end.service.DefenseCommitteeService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/defense-committees")
public class DefenseCommitteeController {
    private DefenseCommitteeService defenseCommitteeService;
    private AuthController authController;

    @Autowired
    public DefenseCommitteeController(DefenseCommitteeService defenseCommitteeService, AuthController authController) {
        this.defenseCommitteeService = defenseCommitteeService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<DefenseCommittee>> getAllDefenseCommittees(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<DefenseCommittee> defenseCommittees = defenseCommitteeService.getAllDefenseCommittees();
                return ResponseEntity.ok(defenseCommittees);
            } else {
                return new SendError<List<DefenseCommittee>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<DefenseCommittee>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DefenseCommittee> getDefenseCommitteeById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                DefenseCommittee defenseCommittee = defenseCommitteeService.getDefenseCommitteeById(id);
                return ResponseEntity.ok(defenseCommittee);
            } else {
                return new SendError<DefenseCommittee>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<DefenseCommittee>().sendNotFound(error.getMessage(), response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<DefenseCommittee>> searchDefenseCommittees(HttpServletResponse response, HttpServletRequest request) {
        try {
            String role = authController.authorize(response, request);
            if (!"SINH_VIEN".equals(role)) {
                List<DefenseCommittee> defenseCommittees = defenseCommitteeService.getAllDefenseCommittees();
//                if ("ADMIN".equals(role))
//                    defenseCommittees = defenseCommitteeService.getAllDefenseCommittees();
//                else
//                    defenseCommittees = defenseCommitteeService.getDefenseCommitteesByLecturer();

                if (request.getParameterMap().get("name") != null) {
                    String name = request.getParameterMap().get("name")[0];
                    for (int i = defenseCommittees.size() - 1; i >= 0 ; i--) {
                        DefenseCommittee defenseCommittee = defenseCommittees.get(i);
                        if (!defenseCommittee.getName().contains(name))
                            defenseCommittees.remove(i);
                    }
                }

                if (request.getParameterMap().get("defensePeriodId") != null) {
                    int defensePeriodId = Integer.parseInt(request.getParameterMap().get("defensePeriodId")[0]);
                    for (int i = defenseCommittees.size() - 1; i >= 0 ; i--) {
                        DefenseCommittee defenseCommittee = defenseCommittees.get(i);
                        if (!defenseCommittee.getDefensePeriod().getId().equals(defensePeriodId))
                            defenseCommittees.remove(i);
                    }
                }

                if (request.getParameterMap().get("roomId") != null) {
                    int roomId = Integer.parseInt(request.getParameterMap().get("roomId")[0]);
                    for (int i = defenseCommittees.size() - 1; i >= 0 ; i--) {
                        DefenseCommittee defenseCommittee = defenseCommittees.get(i);
                        if (!defenseCommittee.getRoom().getId().equals(roomId))
                            defenseCommittees.remove(i);
                    }
                }

                return ResponseEntity.ok(defenseCommittees);
            } else {
                return new SendError<List<DefenseCommittee>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<DefenseCommittee>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<DefenseCommittee> createDefenseCommittee(@RequestBody DefenseCommitteeDTO defenseCommitteeDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                DefenseCommittee dbDefenseCommittee = defenseCommitteeService.createDefenseCommittee(defenseCommitteeDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbDefenseCommittee);
            } else {
                return new SendError<DefenseCommittee>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<DefenseCommittee>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DefenseCommittee> updateDefenseCommitteeById(@PathVariable int id, @RequestBody DefenseCommitteeDTO defenseCommitteeDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                DefenseCommittee updatedDefenseCommittee = defenseCommitteeService.updateDefenseCommitteeById(id, defenseCommitteeDTO);
                return ResponseEntity.ok(updatedDefenseCommittee);
            } else {
                return new SendError<DefenseCommittee>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<DefenseCommittee>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDefenseCommitteeById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                defenseCommitteeService.deleteDefenseCommitteeById(id);
                return ResponseEntity.ok("Đã xóa hội đồng thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
