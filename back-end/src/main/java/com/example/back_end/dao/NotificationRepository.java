package com.example.back_end.dao;

import com.example.back_end.entity.Notification;
import com.example.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUser(User user);
    List<Notification> findFirst20ByStatus(String status);
}
