package com.example.back_end.rest;

import com.example.back_end.dto.LecturerDTO;
import com.example.back_end.dto.ThesisDTO;
import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.Notification;
import com.example.back_end.entity.Thesis;
import com.example.back_end.entity.User;
import com.example.back_end.service.ThesisService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theses")
public class ThesisController {
    private ThesisService thesisService;
    private AuthController authController;

    @Autowired
    public ThesisController(ThesisService thesisService, AuthController authController) {
        this.thesisService = thesisService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<Thesis>> getAllTheses(HttpServletResponse response, HttpServletRequest request) {
        try {
            User user = authController.authenticate(response, request);
            List<Thesis> theses = thesisService.getAllTheses(user);
            return ResponseEntity.ok(theses);
        } catch (Error error) {
            return new SendError<List<Thesis>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Thesis> getThesisById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
                Thesis thesis = thesisService.getThesisById(id);
                return ResponseEntity.ok(thesis);
            } else {
                return new SendError<Thesis>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Thesis>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Thesis>> searchTheses(HttpServletResponse response, HttpServletRequest request) {
        try {
            User user = authController.authenticate(response, request);
            List<Thesis> theses = thesisService.getAllTheses(user);

            if (request.getParameterMap().get("title") != null) {
                String title = request.getParameterMap().get("title")[0];
                for (int i = theses.size() - 1; i >= 0; i--) {
                    Thesis thesis = theses.get(i);
                    if (!thesis.getTitle().contains(title))
                        theses.remove(i);
                }
            }

            if (request.getParameterMap().get("status") != null) {
                String status = request.getParameterMap().get("status")[0];
                for (int i = theses.size() - 1; i >= 0; i--) {
                    Thesis thesis = theses.get(i);
                    if (!thesis.getStatus().equals(status))
                        theses.remove(i);
                }
            }

            if (request.getParameterMap().get("lecturerId") != null) {
                int lecturerId = Integer.parseInt(request.getParameterMap().get("lecturerId")[0]);
                for (int i = theses.size() - 1; i >= 0; i--) {
                    Thesis thesis = theses.get(i);
                    if (!thesis.getLecturer().getId().equals(lecturerId))
                        theses.remove(i);
                }
            }

            if (request.getParameterMap().get("timeSlotId") != null) {
                int timeSlotId = Integer.parseInt(request.getParameterMap().get("timeSlotId")[0]);
                for (int i = theses.size() - 1; i >= 0; i--) {
                    Thesis thesis = theses.get(i);
                    if (thesis.getTimeSlot() == null || !thesis.getTimeSlot().getId().equals(timeSlotId))
                        theses.remove(i);
                }
            }

            if (request.getParameterMap().get("query") != null) {
                String query = request.getParameterMap().get("query")[0];
                for (int i = theses.size() - 1; i >= 0; i--) {
                    Thesis thesis = theses.get(i);
                    if (!thesis.getTitle().contains(query) && !thesis.getStudent().getUser().getFullname().contains(query) && !thesis.getLecturer().getUser().getFullname().contains(query) && !thesis.getLecturer().getFaculty().getName().contains(query))
                        theses.remove(i);
                }
            }

            return ResponseEntity.ok(theses);
        } catch (Error error) {
            return new SendError<List<Thesis>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<Thesis> createThesis(@RequestBody ThesisDTO thesisDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Thesis dbThesis = thesisService.createThesis(thesisDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbThesis);
            } else {
                return new SendError<Thesis>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Thesis>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Thesis> updateThesisById(@PathVariable int id, @RequestBody ThesisDTO thesisDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Thesis updatedThesis = thesisService.updateThesisById(id, thesisDTO);
                return ResponseEntity.ok(updatedThesis);
            } else {
                return new SendError<Thesis>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Thesis>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("scheduling/{id}")
    public ResponseEntity<Thesis> scheduling(@PathVariable int id, @RequestBody ThesisDTO thesisDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Thesis updatedThesis = thesisService.assignTimeSlot(id, thesisDTO);
                return ResponseEntity.ok(updatedThesis);
            } else {
                return new SendError<Thesis>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Thesis>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("unscheduled/{id}")
    public ResponseEntity<Thesis> unscheduled(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Thesis updatedThesis = thesisService.removeTimeSlot(id);
                return ResponseEntity.ok(updatedThesis);
            } else {
                return new SendError<Thesis>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Thesis>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("auto-scheduling/{id}")
    public ResponseEntity<List<Thesis>> autoScheduling(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Thesis> theses = thesisService.autoScheduling(id);
                return ResponseEntity.ok(theses);
            } else {
                return new SendError<List<Thesis>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Thesis>>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PostMapping("publish/{id}")
    public ResponseEntity<List<Notification>> publish(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Notification> notifications = thesisService.publishSchedules(id);
                return ResponseEntity.ok(notifications);
            } else {
                return new SendError<List<Notification>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Notification>>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteThesisById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                thesisService.deleteThesisById(id);
                return ResponseEntity.ok("Đã xóa luận văn thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
