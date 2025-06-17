package com.example.back_end.service;

import com.example.back_end.entity.CommitteeMember;
import com.example.back_end.entity.DefenseSession;
import com.example.back_end.entity.Thesis;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Date;
import java.util.List;

@Service
public class EmailService {
    private JavaMailSender javaMailSender;
    private TemplateEngine templateEngine;

    @Autowired
    public EmailService(JavaMailSender javaMailSender, TemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        javaMailSender.send(message);
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }

    public void sendRequestAvailabilityEmail(String to, String periodName, Date endDate) throws MessagingException {
        Context context = new Context();
        context.setVariable("periodName", periodName);
        context.setVariable("endDate", endDate);

        String htmlContent = templateEngine.process("request-availability", context);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setSubject("Yêu cầu đăng ký lịch bận cho đợt bảo vệ " + periodName);
        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }

    public void sendCommitteeAssignmentEmail(String to, String lecturerFullName, String committeeRoleName, String defenseCommitteeName, List<Object> assignedTheses) throws MessagingException {
        Context context = new Context();
        context.setVariable("lecturerFullName", lecturerFullName);
        context.setVariable("committeeRoleName", committeeRoleName);
        context.setVariable("defenseCommitteeName", defenseCommitteeName);
        context.setVariable("assignedTheses", assignedTheses);

        String htmlContent = templateEngine.process("committee-assignment", context);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setSubject("Thông báo phân công Hội đồng chấm LVTN");
        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }

    public void sendLecturerScheduleEmail(String to, String lecturerFullName, List<Object> scheduledSessions) throws MessagingException {
        Context context = new Context();
        context.setVariable("lecturerFullName", lecturerFullName);
        context.setVariable("scheduledSessions", scheduledSessions);

        String htmlContent = templateEngine.process("lecturer-schedule", context);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setSubject("Lịch tham gia Hội đồng chấm LVTN của thầy/cô " + lecturerFullName);
        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }

    public void sendStudentScheduleEmail(String to, String studentFullName, String thesisTitle, DefenseSession defenseSession, List<CommitteeMember> committeeMembers) throws MessagingException {
        Context context = new Context();
        context.setVariable("studentFullName", studentFullName);
        context.setVariable("thesisTitle", thesisTitle);
        context.setVariable("sessionDate", defenseSession.getTimeSlot().getDate());
        context.setVariable("sessionTime", defenseSession.getTimeSlot().getStart());
        context.setVariable("locationName", defenseSession.getRoom().getName());
        context.setVariable("committeeMembers", committeeMembers);

        String htmlContent = templateEngine.process("student-schedule", context);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setSubject("Thông báo Lịch bảo vệ Luận văn Tốt nghiệp");
        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }
}
