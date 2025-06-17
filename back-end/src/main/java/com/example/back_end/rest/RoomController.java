package com.example.back_end.rest;

import com.example.back_end.entity.Degree;
import com.example.back_end.entity.Room;
import com.example.back_end.service.RoomService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private RoomService roomService;
    private AuthController authController;

    @Autowired
    public RoomController(RoomService roomService, AuthController authController) {
        this.roomService = roomService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<Room> rooms = roomService.getAllRooms();
                return ResponseEntity.ok(rooms);
            } else {
                return new SendError<List<Room>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<Room>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Room room = roomService.getRoomById(id);
                return ResponseEntity.ok(room);
            } else {
                return new SendError<Room>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Room>().sendNotFound(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Room dbRoom = roomService.createRoom(room);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbRoom);
            } else {
                return new SendError<Room>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Room>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoomById(@PathVariable int id, @RequestBody Room room, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                Room updatedRoom = roomService.updateRoomById(id, room);
                return ResponseEntity.ok(updatedRoom);
            } else {
                return new SendError<Room>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<Room>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoomById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                roomService.deleteRoomById(id);
                return ResponseEntity.ok("Đã xóa phòng thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
