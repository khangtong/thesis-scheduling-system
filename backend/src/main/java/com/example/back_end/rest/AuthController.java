package com.example.back_end.rest;

import com.example.back_end.dto.UserDTO;
import com.example.back_end.entity.User;
import com.example.back_end.service.UserService;
import com.example.back_end.utils.JwtTokenProvider;
import com.example.back_end.utils.SendError;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {
    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public ResponseEntity<Object> createAndSendToken(User user, HttpServletResponse response) {
        String token = jwtTokenProvider.generateToken(user);
        response.setHeader("Authorization", "Bearer " + token);

        int maxAge = 60 * 60 * 24 * 3; // 30 days in seconds

        Cookie cookie = new Cookie("userAuthToken", token);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        cookie.setSecure(true);
        cookie.setHttpOnly(true);

        response.addCookie(cookie);
        response.setStatus(201);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", token);
        responseBody.put("status", "success");
        responseBody.put("user", user);

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody UserDTO userDTO, HttpServletResponse response) {
        User dbUser;

        if (userDTO.getUsername() != null) {
            dbUser = userService.getUserByUsername(userDTO.getUsername());
            if (dbUser == null) {
                return new SendError<Object>().sendBadRequest("Email, tên tài khoản hoặc mật khẩu không đúng", response);
            }
        } else {
            dbUser = userService.getUserByEmail(userDTO.getEmail());
        }

        if (dbUser == null || !passwordEncoder.matches(userDTO.getPassword(), dbUser.getPassword())) {
            return new SendError<Object>().sendBadRequest("Email, tên tài khoản hoặc mật khẩu không đúng", response);
        }

        return createAndSendToken(dbUser, response);
    }

    public User authenticate(HttpServletResponse response, HttpServletRequest request) {
        String token = new String("");

        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer")) {
            token = request.getHeader("Authorization").split(" ")[1];
        } else if (request.getCookies() != null && request.getCookies().length > 0) {
            token = request.getCookies()[0].getValue();
        }

        if ("".equals(token) || !jwtTokenProvider.verifyToken(token)) {
            throw new Error("Token không hợp lệ");
        }

        User user = userService.getUserByEmail(jwtTokenProvider.getEmailFromJWT(token));

        if (user == null) {
            throw new Error("Không tìm thấy người dùng có email này");
        }

        return user;
    }

    public String authorize(HttpServletResponse response, HttpServletRequest request) {
        try {
            User user = authenticate(response, request);
            return user.getRole().getName();
        } catch (Error error) {
            throw new Error(error.getMessage());
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<Object> logout(HttpServletResponse response, HttpServletRequest request) {
        if (authenticate(response, request) == null) {
            return new SendError<Object>().sendBadRequest("Người dùng chưa đăng nhập", response);
        }

        response.reset();
        response.setHeader("jwt", "");

        Cookie cookie = new Cookie("userAuthToken", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setSecure(true);
        cookie.setHttpOnly(true);

        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }
}
