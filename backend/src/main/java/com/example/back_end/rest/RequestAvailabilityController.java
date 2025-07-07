package com.example.back_end.rest;

import com.example.back_end.dto.RequestAvailabilityDTO;
import com.example.back_end.entity.Faculty;
import com.example.back_end.entity.Notification;
import com.example.back_end.service.RequestAvailabilityService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/request-availability")
public class RequestAvailabilityController {
    private RequestAvailabilityService requestAvailabilityService;
    private AuthController authController;

    @Autowired
    public RequestAvailabilityController(RequestAvailabilityService requestAvailabilityService, AuthController authController) {
        this.requestAvailabilityService = requestAvailabilityService;
        this.authController = authController;
    }

    @PostMapping
    public ResponseEntity<List<Notification>> createAvailabilityRequests(@RequestBody RequestAvailabilityDTO requestAvailabilityDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Notification> notifications = requestAvailabilityService.sendAvailabilityRequests(requestAvailabilityDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(notifications);
            } else {
                return new SendError<List<Notification>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Notification>>().sendBadRequest(error.getMessage(), response);
        }
    }
}
