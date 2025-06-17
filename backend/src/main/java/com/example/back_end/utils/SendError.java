package com.example.back_end.utils;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public class SendError<Type> {
    public ResponseEntity<Type> sendNotFound(String msg, HttpServletResponse response) {
        try {
            response.sendError(404, msg);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<Type> sendBadRequest(String msg, HttpServletResponse response) {
        try {
            response.sendError(400, msg);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<Type> sendUnauthorized(String msg, HttpServletResponse response) {
        try {
            response.sendError(401, msg);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.badRequest().build();
    }
}
