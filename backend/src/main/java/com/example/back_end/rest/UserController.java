package com.example.back_end.rest;

import com.example.back_end.dto.UserDTO;
import com.example.back_end.entity.User;
import com.example.back_end.service.UserService;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private UserService userService;
    private AuthController authController;

    @Autowired
    public UserController(UserService userService, AuthController authController) {
        this.userService = userService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!"SINH_VIEN".equals(authController.authorize(response, request))) {
                List<User> users = userService.getAllUsers();
                return ResponseEntity.ok(users);
            } else {
                return new SendError<List<User>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<User>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                User user = userService.getUserById(id);
                return ResponseEntity.ok(user);
            } else {
                return new SendError<User>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<User>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(HttpServletResponse response, HttpServletRequest request) {
        try {
            User user = authController.authenticate(response, request);
            return ResponseEntity.ok(user);
        } catch (Error error) {
            return new SendError<User>().sendNotFound(error.getMessage(), response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<User> users = userService.getAllUsers();

                if (request.getParameterMap().get("query") != null) {
                    String query = request.getParameterMap().get("query")[0];
                    for (int i = users.size() - 1; i >= 0; i--) {
                        if (!users.get(i).getUsername().contains(query) && !users.get(i).getEmail().contains(query) && !users.get(i).getFullname().contains(query))
                            users.remove(i);
                    }
                }

                if (request.getParameterMap().get("roleId") != null) {
                    int roleId = Integer.parseInt(request.getParameterMap().get("roleId")[0]);
                    for (int i = users.size() - 1; i >= 0; i--) {
                        if (!users.get(i).getRole().getId().equals(roleId))
                            users.remove(i);
                    }
                }

                return ResponseEntity.ok(users);
            } else {
                return new SendError<List<User>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<User>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO userDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                User dbUser = userService.createUser(userDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbUser);
            } else {
                return new SendError<User>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<User>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserById(@PathVariable int id, @RequestBody UserDTO userDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                User updatedUser = userService.updateUserById(id, userDTO);
                return ResponseEntity.ok(updatedUser);
            } else {
                return new SendError<User>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<User>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMe(@RequestBody UserDTO userDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            User user = authController.authenticate(response, request);
            User updatedUser = userService.updateMe(user.getId(), userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (Error error) {
            return new SendError<User>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                userService.deleteUserById(id);
                return ResponseEntity.ok("Đã xóa người dùng thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
