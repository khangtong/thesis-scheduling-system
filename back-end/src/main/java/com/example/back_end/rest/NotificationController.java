package com.example.back_end.rest;

import com.example.back_end.dto.NotificationDTO;
import com.example.back_end.entity.Faculty;
import com.example.back_end.entity.Notification;
import com.example.back_end.entity.User;
import com.example.back_end.service.NotificationService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private NotificationService notificationService;
    private AuthController authController;

    @Autowired
    public NotificationController(NotificationService notificationService, AuthController authController) {
        this.notificationService = notificationService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications(HttpServletResponse response, HttpServletRequest request) {
        try {
            User user = authController.authenticate(response, request);
            List<Notification> notifications = notificationService.getAllNotifications(user);
            return ResponseEntity.ok(notifications);
        } catch (Error error) {
            return new SendError<List<Notification>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Notification notification = notificationService.getNotificationById(id);
                return ResponseEntity.ok(notification);
            } else {
                return new SendError<Notification>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Notification>().sendNotFound(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody NotificationDTO notificationDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Notification dbNotification = notificationService.createNotification(notificationDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbNotification);
            } else {
                return new SendError<Notification>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Notification>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotificationById(@PathVariable int id, @RequestBody NotificationDTO notificationDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Notification updatedNotification = notificationService.updateNotificationById(id, notificationDTO);
                return ResponseEntity.ok(updatedNotification);
            } else {
                return new SendError<Notification>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Notification>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotificationById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                notificationService.deleteNotificationById(id);
                return ResponseEntity.ok("Đã xóa thông báo thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
