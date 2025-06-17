package com.example.back_end.rest;

import com.example.back_end.dto.CommitteeMemberDTO;
import com.example.back_end.dto.NotificationDTO;
import com.example.back_end.entity.CommitteeMember;
import com.example.back_end.entity.Faculty;
import com.example.back_end.service.CommitteeMemberService;
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
@RequestMapping("/api/committee-members")
public class CommitteeMemberController {
    private CommitteeMemberService committeeMemberService;
    private AuthController authController;

    @Autowired
    public CommitteeMemberController(CommitteeMemberService committeeMemberService, AuthController authController) {
        this.committeeMemberService = committeeMemberService;
        this.authController = authController;
    }

    @GetMapping
    public ResponseEntity<List<CommitteeMember>> getAllCommitteeMembers(HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                List<CommitteeMember> committeeMembers = committeeMemberService.getAllCommitteeMembers();
                return ResponseEntity.ok(committeeMembers);
            } else {
                return new SendError<List<CommitteeMember>>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<List<CommitteeMember>>().sendUnauthorized(error.getMessage(), response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommitteeMember> getCommitteeMemberById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                CommitteeMember committeeMember = committeeMemberService.getCommitteeMemberById(id);
                return ResponseEntity.ok(committeeMember);
            } else {
                return new SendError<CommitteeMember>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<CommitteeMember>().sendNotFound(error.getMessage(), response);
        }
    }

    @PostMapping
    public ResponseEntity<CommitteeMember> createCommitteeMember(@RequestBody CommitteeMemberDTO committeeMemberDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                CommitteeMember dbCommitteeMember = committeeMemberService.createCommitteeMember(committeeMemberDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(dbCommitteeMember);
            } else {
                return new SendError<CommitteeMember>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<CommitteeMember>().sendBadRequest(error.getMessage(), response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommitteeMember> updateCommitteeMemberById(@PathVariable int id, @RequestBody CommitteeMemberDTO committeeMemberDTO, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                CommitteeMember updatedCommitteeMember = committeeMemberService.updateCommitteeMemberById(id, committeeMemberDTO);
                return ResponseEntity.ok(updatedCommitteeMember);
            } else {
                return new SendError<CommitteeMember>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<CommitteeMember>().sendBadRequest(error.getMessage(), response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCommitteeMemberById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        try {
            if ("ADMIN".equals(authController.authorize(response, request))) {
                committeeMemberService.deleteCommitteeMemberById(id);
                return ResponseEntity.ok("Đã xóa thành viên hội đồng thành công");
            } else {
                return new SendError<String>().sendUnauthorized("Bạn không có quyền sử dụng chức năng này", response);
            }
        } catch (Error error) {
            return new SendError<String>().sendNotFound(error.getMessage(), response);
        }
    }
}
