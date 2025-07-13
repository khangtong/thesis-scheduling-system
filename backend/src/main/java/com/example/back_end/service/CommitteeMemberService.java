package com.example.back_end.service;

import com.example.back_end.dao.*;
import com.example.back_end.dto.CommitteeMemberDTO;
import com.example.back_end.dto.NotificationDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommitteeMemberService {
    private CommitteeMemberRepository committeeMemberRepository;
    private DefenseCommitteeRepository defenseCommitteeRepository;
    private LecturerRepository lecturerRepository;
    private CommitteeRoleRepository committeeRoleRepository;
    private NotificationRepository notificationRepository;
    private ThesisRepository thesisRepository;
    private TemplateEngine templateEngine;

    @Autowired
    public CommitteeMemberService(CommitteeMemberRepository committeeMemberRepository, DefenseCommitteeRepository defenseCommitteeRepository, LecturerRepository lecturerRepository, CommitteeRoleRepository committeeRoleRepository, NotificationRepository notificationRepository, ThesisRepository thesisRepository, TemplateEngine templateEngine) {
        this.committeeMemberRepository = committeeMemberRepository;
        this.defenseCommitteeRepository = defenseCommitteeRepository;
        this.lecturerRepository = lecturerRepository;
        this.committeeRoleRepository = committeeRoleRepository;
        this.notificationRepository = notificationRepository;
        this.thesisRepository = thesisRepository;
        this.templateEngine = templateEngine;
    }

    @Transactional(readOnly = true)
    public List<CommitteeMember> getAllCommitteeMembers() {
        return committeeMemberRepository.findAll();
    }

    @Transactional(readOnly = true)
    public CommitteeMember getCommitteeMemberById(int id) {
        CommitteeMember committeeMember = committeeMemberRepository.findById(id).orElse(null);
        if (committeeMember == null)
            throw new Error("Không tìm thấy thành viên hội đồng");
        return committeeMember;
    }

    @Transactional(readOnly = true)
    public List<CommitteeMember> getCommitteeMembersByDefenseCommittee(int id) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");

        return committeeMemberRepository.findByDefenseCommittee(defenseCommittee);
    }

    @Transactional(readOnly = true)
    public List<CommitteeMember> getCommitteeMembersByLecturer(int id) {
        Lecturer lecturer = lecturerRepository.findById(id).orElse(null);
        if (lecturer == null)
            throw new Error("Không tìm thấy giảng viên");

        return committeeMemberRepository.findByLecturer(lecturer);
    }

    @Transactional
    public CommitteeMember createCommitteeMember(CommitteeMemberDTO committeeMemberDTO) {
        CommitteeMember committeeMember = new CommitteeMember();
        Notification notification = new Notification();
        String lecturerFullName;
        String defenseCommitteeName;
        String committeeRoleName;
        List<Thesis> assignedTheses;

        if (committeeMemberDTO.getDefenseCommitteeId() != null) {
            DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(committeeMemberDTO.getDefenseCommitteeId()).orElse(null);
            if (defenseCommittee == null)
                throw new Error("Không tìm thấy hội đồng");
            committeeMember.setDefenseCommittee(defenseCommittee);
            defenseCommitteeName = defenseCommittee.getName();
            assignedTheses = thesisRepository.findByDefenseCommittee(defenseCommittee);
        } else {
            throw new Error("Hội đồng không được là rỗng");
        }

        if (committeeMemberDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(committeeMemberDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            committeeMember.setLecturer(lecturer);
            lecturerFullName = lecturer.getUser().getFullname();
            notification.setUser(lecturer.getUser());
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        if (committeeMemberDTO.getCommitteeRoleId() != null) {
            CommitteeRole committeeRole = committeeRoleRepository.findById(committeeMemberDTO.getCommitteeRoleId()).orElse(null);
            if (committeeRole == null)
                throw new Error("Không tìm thấy vai trò hội đồng");
            committeeMember.setCommitteeRole(committeeRole);
            committeeRoleName = committeeRole.getName();
        } else {
            throw new Error("Vai trò hội đồng không được là rỗng");
        }

        notification.setTitle("Thông báo phân công Hội đồng chấm LVTN");

        Context context = new Context();
        context.setVariable("lecturerFullName", lecturerFullName);
        context.setVariable("committeeRoleName", committeeRoleName);
        context.setVariable("defenseCommitteeName", defenseCommitteeName);
        context.setVariable("assignedTheses", assignedTheses);

        String htmlContent = templateEngine.process("emails/committee-assignment", context);
        notification.setContent(htmlContent);
        notification.setStatus("Đang xử lý");
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        return committeeMemberRepository.save(committeeMember);
    }

    @Transactional
    public CommitteeMember updateCommitteeMemberById(int id, CommitteeMemberDTO committeeMemberDTO) {
        CommitteeMember committeeMember = committeeMemberRepository.findById(id).orElse(null);
        if (committeeMember == null)
            throw new Error("Không tìm thấy thành viên hội đồng");

        if (committeeMemberDTO.getDefenseCommitteeId() != null) {
            DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(committeeMemberDTO.getDefenseCommitteeId()).orElse(null);
            if (defenseCommittee == null)
                throw new Error("Không tìm thấy hội đồng");
            committeeMember.setDefenseCommittee(defenseCommittee);
        } else {
            throw new Error("Hội đồng không được là rỗng");
        }

        if (committeeMemberDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(committeeMemberDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            committeeMember.setLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        if (committeeMemberDTO.getCommitteeRoleId() != null) {
            CommitteeRole committeeRole = committeeRoleRepository.findById(committeeMemberDTO.getCommitteeRoleId()).orElse(null);
            if (committeeRole == null)
                throw new Error("Không tìm thấy vai trò hội đồng");
            committeeMember.setCommitteeRole(committeeRole);
        } else {
            throw new Error("Vai trò hội đồng không được là rỗng");
        }

        return committeeMemberRepository.save(committeeMember);
    }

    @Transactional
    public void deleteCommitteeMemberById(int id) {
        CommitteeMember committeeMember = committeeMemberRepository.findById(id).orElse(null);
        if (committeeMember == null)
            throw new Error("Không tìm thấy thành viên hội đồng");
        committeeMemberRepository.deleteById(id);
    }

    @Transactional
    public void deleteCommitteeMembersByDefenseCommittee(int id) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");
        List<CommitteeMember> committeeMembers = committeeMemberRepository.findByDefenseCommittee(defenseCommittee);
        committeeMemberRepository.deleteAll(committeeMembers);
    }
}
