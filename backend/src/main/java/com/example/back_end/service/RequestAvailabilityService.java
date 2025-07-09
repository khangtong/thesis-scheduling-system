package com.example.back_end.service;

import com.example.back_end.dao.*;
import com.example.back_end.dto.RequestAvailabilityDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class RequestAvailabilityService {
    private DefensePeriodRepository defensePeriodRepository;
    private LecturerRepository lecturerRepository;
    private FacultyRepository facultyRepository;
    private NotificationRepository notificationRepository;
    private TemplateEngine templateEngine;
    private TimeSlotService timeSlotService;

    @Autowired
    public RequestAvailabilityService(DefensePeriodRepository defensePeriodRepository, LecturerRepository lecturerRepository, FacultyRepository facultyRepository, NotificationRepository notificationRepository, TemplateEngine templateEngine, TimeSlotService timeSlotService) {
        this.defensePeriodRepository = defensePeriodRepository;
        this.lecturerRepository = lecturerRepository;
        this.facultyRepository = facultyRepository;
        this.notificationRepository = notificationRepository;
        this.templateEngine = templateEngine;
        this.timeSlotService = timeSlotService;
    }

    @Transactional
    public List<Notification> sendAvailabilityRequests(RequestAvailabilityDTO requestAvailabilityDTO) {
        List<Notification> notifications = new ArrayList<>();
        String defensePeriodName = "";

        if (requestAvailabilityDTO.getDefensePeriodId() != null) {
            DefensePeriod defensePeriod = defensePeriodRepository.findById(requestAvailabilityDTO.getDefensePeriodId()).orElse(null);
            if (defensePeriod == null)
                throw new Error("Không tìm thấy đợt bảo vệ");
            if (!defensePeriod.isActive())
                throw new Error("Đợt bảo vệ không hoạt động");
            defensePeriodName = defensePeriod.getName();
            List<TimeSlot> timeSlots = timeSlotService.getTimeSlotsByDateRange(defensePeriod.getStart().toLocalDate(), defensePeriod.getEnd().toLocalDate());
            if (timeSlots.isEmpty())
                throw new Error("Phải tạo các khung giờ cho đợt bảo vệ để yêu cầu đăng ký lịch bận");
        }

        if (requestAvailabilityDTO.getSelectedFaculties() != null) {
            List<Integer> selectedFaculties = requestAvailabilityDTO.getSelectedFaculties();
            for (int i = 0; i < selectedFaculties.size(); i++) {
                Faculty faculty = facultyRepository.findById(selectedFaculties.get(i)).orElse(null);
                if (faculty == null)
                    throw new Error("Không tìm thấy khoa");
                List<Lecturer> lecturers = lecturerRepository.findByFaculty(faculty);
                for (int j = 0; j < lecturers.size(); j++) {
                    if (lecturers.get(j).getUser().isActive()) {
                        Notification notification = new Notification();
                        notification.setTitle("Yêu cầu giảng viên thuộc khoa " + faculty.getName() + " đăng ký lịch bận cho đợt bảo vệ " + defensePeriodName);

                        Context context = new Context();
                        context.setVariable("periodName", defensePeriodName);
                        context.setVariable("endDate", requestAvailabilityDTO.getDeadline().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

                        String htmlContent = templateEngine.process("emails/request-availability", context);
                        notification.setContent(htmlContent);
                        notification.setStatus("Đang xử lý");
                        notification.setCreatedAt(LocalDateTime.now());
                        notification.setUser(lecturers.get(j).getUser());
                        notifications.add(notification);
                    }
                }
            }
        }

        return notificationRepository.saveAll(notifications);
    }
}
