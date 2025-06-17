package com.example.back_end.service;

import com.example.back_end.dao.NotificationRepository;
import com.example.back_end.dao.UserRepository;
import com.example.back_end.dto.NotificationDTO;
import com.example.back_end.entity.Lecturer;
import com.example.back_end.entity.Notification;
import com.example.back_end.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    private NotificationRepository notificationRepository;
    private UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Notification> getAllNotifications(User user) {
        if ("ADMIN".equals(user.getRole().getName()))
            return notificationRepository.findAll();
        else
            return notificationRepository.findByUser(user);
    }

    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByStatus(String status) {
        return notificationRepository.findFirst20ByStatus(status);
    }

    @Transactional(readOnly = true)
    public Notification getNotificationById(int id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null)
            throw new Error("Không tìm thấy thông báo");
        return notification;
    }

    @Transactional
    public Notification createNotification(NotificationDTO notificationDTO) {
        Notification notification = new Notification();

        if ("".equals(notificationDTO.getTitle()))
            throw new Error("Tiêu đề thông báo không được là rỗng");
        notification.setTitle(notificationDTO.getTitle());

        if ("".equals(notificationDTO.getContent()))
            throw new Error("Nội dung thông báo không được là rỗng");
        notification.setContent(notificationDTO.getContent());

        if ("".equals(notificationDTO.getStatus()))
            throw new Error("Trạng thái thông báo không được là rỗng");
        notification.setStatus(notificationDTO.getStatus());

        if (notificationDTO.getUserId() != null) {
            User user = userRepository.findById(notificationDTO.getUserId()).orElse(null);
            if (user == null)
                throw new Error("Không tìm thấy người dùng");
            notification.setUser(user);
        } else {
            throw new Error("Người dùng không được là rỗng");
        }

        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification updateNotificationById(int id, NotificationDTO notificationDTO) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null)
            throw new Error("Không tìm thấy thông báo");

        if ("".equals(notificationDTO.getTitle()))
            throw new Error("Tiêu đề thông báo không được là rỗng");
        notification.setTitle(notificationDTO.getTitle());

        if ("".equals(notificationDTO.getContent()))
            throw new Error("Nội dung thông báo không được là rỗng");
        notification.setContent(notificationDTO.getContent());

        if ("".equals(notificationDTO.getStatus()))
            throw new Error("Trạng thái thông báo không được là rỗng");
        notification.setStatus(notificationDTO.getStatus());

        if (notificationDTO.getUserId() != null) {
            User user = userRepository.findById(notificationDTO.getUserId()).orElse(null);
            if (user == null)
                throw new Error("Không tìm thấy người dùng");
            notification.setUser(user);
        } else {
            throw new Error("Người dùng không được là rỗng");
        }

        return notificationRepository.save(notification);
    }

    @Transactional
    public void deleteNotificationById(int id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null)
            throw new Error("Không tìm thấy thông báo");
        notificationRepository.deleteById(id);
    }
}
