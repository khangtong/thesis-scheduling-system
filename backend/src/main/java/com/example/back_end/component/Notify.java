package com.example.back_end.component;

import com.example.back_end.dto.NotificationDTO;
import com.example.back_end.entity.Notification;
import com.example.back_end.service.EmailService;
import com.example.back_end.service.NotificationService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class Notify {
    private EmailService emailService;
    private NotificationService notificationService;

    @Autowired
    public Notify(EmailService emailService, NotificationService notificationService) {
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    @Scheduled(fixedRate = 1, timeUnit = TimeUnit.MINUTES)
    public void sendNotification() throws MessagingException {
        List<Notification> notifications = notificationService.getNotificationsByStatus("Đang xử lý");

        for (int i = 0; i < notifications.size(); i++) {
            Notification notification = notifications.get(i);
            emailService.sendHtmlEmail(notification.getUser().getEmail(), notification.getTitle(), notification.getContent());

            NotificationDTO notificationDTO = new NotificationDTO();
            notificationDTO.setTitle(notification.getTitle());
            notificationDTO.setContent(notification.getContent());
            notificationDTO.setStatus("Đã gửi");
            notificationDTO.setUserId(notification.getUser().getId());

            notificationService.updateNotificationById(notification.getId(), notificationDTO);
        }
    }
}
