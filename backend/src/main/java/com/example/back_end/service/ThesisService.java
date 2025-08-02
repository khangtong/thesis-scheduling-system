package com.example.back_end.service;

import com.example.back_end.dao.*;
import com.example.back_end.dto.ScheduledSessionDTO;
import com.example.back_end.dto.ThesisDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ThesisService {
    private ThesisRepository thesisRepository;
    private StudentRepository studentRepository;
    private LecturerRepository lecturerRepository;
    private TimeSlotRepository timeSlotRepository;
    private CommitteeMemberRepository committeeMemberRepository;
    private DefensePeriodRepository defensePeriodRepository;
    private NotificationRepository notificationRepository;
    private TemplateEngine templateEngine;

    @Autowired
    public ThesisService(ThesisRepository thesisRepository, StudentRepository studentRepository, LecturerRepository lecturerRepository, TimeSlotRepository timeSlotRepository, CommitteeMemberRepository committeeMemberRepository, DefensePeriodRepository defensePeriodRepository, NotificationRepository notificationRepository, TemplateEngine templateEngine) {
        this.thesisRepository = thesisRepository;
        this.studentRepository = studentRepository;
        this.lecturerRepository = lecturerRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.committeeMemberRepository = committeeMemberRepository;
        this.defensePeriodRepository = defensePeriodRepository;
        this.notificationRepository = notificationRepository;
        this.templateEngine = templateEngine;
    }

    @Transactional(readOnly = true)
    public List<Thesis> getAllTheses(User user) {
        List<Thesis> theses = new ArrayList<>();

        if ("GIANG_VIEN".equals(user.getRole().getName())) {
            List<Thesis> allTheses = thesisRepository.findAll();
            Lecturer lecturer = lecturerRepository.findByUser(user);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");

            for (Thesis thesis : allTheses) {
                if (thesis.getLecturer().equals(lecturer))
                    theses.add(thesis);
                else {
                    if (thesis.getTimeSlot() != null) {
                        DefenseCommittee defenseCommittee = thesis.getTimeSlot().getDefenseCommittee();
                        List<CommitteeMember> committeeMembers = committeeMemberRepository.findByDefenseCommittee(defenseCommittee);
                        for (CommitteeMember committeeMember : committeeMembers) {
                            if (committeeMember.getLecturer().equals(lecturer)) {
                                theses.add(thesis);
                                break;
                            }
                        }
                    }
                }
            }
        } else if ("SINH_VIEN".equals(user.getRole().getName())) {
            Student student = studentRepository.findByUser(user);
            if (student == null)
                throw new Error("Không tìm thấy sinh viên");
            theses.add(thesisRepository.findByStudent(student));
        } else {
            theses = thesisRepository.findAll();
        }

        return theses;
    }

    @Transactional(readOnly = true)
    public Thesis getThesisById(int id) {
        Thesis thesis = thesisRepository.findById(id).orElse(null);
        if (thesis == null)
            throw new Error("Không tìm thấy luận văn");
        return thesis;
    }

    @Transactional
    public Thesis createThesis(ThesisDTO thesisDTO) {
        Thesis thesis = new Thesis();

        if ("".equals(thesisDTO.getTitle()))
            throw new Error("Tên đề tài luận văn không được là rỗng");
        thesis.setTitle(thesisDTO.getTitle());

        if (thesisDTO.getStudentId() != null) {
            Student student = studentRepository.findById(thesisDTO.getStudentId()).orElse(null);
            if (student == null)
                throw new Error("Không tìm thấy sinh viên");
            thesis.setStudent(student);
        } else {
            throw new Error("Sinh viên không được là rỗng");
        }

        if (thesisDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(thesisDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            thesis.setLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        thesis.setStatus("Chưa xếp lịch");
        thesis.setTimeSlot(null);
        thesis.setCreatedAt(LocalDateTime.now());
        thesis.setUpdatedAt(LocalDateTime.now());
        return thesisRepository.save(thesis);
    }

    @Transactional
    public Thesis updateThesisById(int id, ThesisDTO thesisDTO) {
        Thesis thesis = thesisRepository.findById(id).orElse(null);
        if (thesis == null)
            throw new Error("Không tìm thấy luận văn");

        if ("".equals(thesisDTO.getTitle()))
            throw new Error("Tên đề tài luận văn không được là rỗng");
        thesis.setTitle(thesisDTO.getTitle());

        if (thesisDTO.getStudentId() != null) {
            Student student = studentRepository.findById(thesisDTO.getStudentId()).orElse(null);
            if (student == null)
                throw new Error("Không tìm thấy sinh viên");
            if (!thesis.getStudent().equals(student))
                thesis.setStudent(student);
        } else {
            throw new Error("Sinh viên không được là rỗng");
        }

        if (thesisDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(thesisDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            thesis.setLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        thesis.setUpdatedAt(LocalDateTime.now());
        return thesisRepository.save(thesis);
    }

    @Transactional
    public Thesis assignTimeSlot(int id, ThesisDTO thesisDTO) {
        Thesis thesis = thesisRepository.findById(id).orElse(null);
        if (thesis == null)
            throw new Error("Không tìm thấy luận văn");

        if (thesisDTO.getTimeSlotId() != null) {
            // Check if this thesis was assigned to this time slot before
            if (thesis.getTimeSlot() != null && thesis.getTimeSlot().getId().equals(thesisDTO.getTimeSlotId()))
                throw new Error("Luận văn đã được xếp vào khung giờ này trước đó");

            TimeSlot timeSlot = timeSlotRepository.findById(thesisDTO.getTimeSlotId()).orElse(null);
            if (timeSlot == null)
                throw new Error("Không tìm thấy khung giờ");

            // Check if another thesis was assigned to this time slot
            Thesis thesis1 = thesisRepository.findByTimeSlot(timeSlot);
            if (thesis1 != null)
                throw new Error("Đã có luận văn khác trong khung giờ này");

            // Check if the thesis's advisor is a secretary of the defense committee
            List<CommitteeMember> committeeMembers = committeeMemberRepository.findByDefenseCommittee(timeSlot.getDefenseCommittee());
            for (CommitteeMember committeeMember : committeeMembers) {
                if (committeeMember.getCommitteeRole().getName().equals("Thư ký") && !committeeMember.getLecturer().equals(thesis.getLecturer()))
                    throw new Error("Thư ký của hội đồng phải là giảng viên hướng dẫn luận văn");
            }

            thesis.setTimeSlot(timeSlot);
            thesis.setStatus("Đã xếp lịch");
            thesis.setUpdatedAt(LocalDateTime.now());
        } else {
            throw new Error("Khung giờ không hợp lệ");
        }

        return thesisRepository.save(thesis);
    }

    @Transactional
    public Thesis removeTimeSlot(int id) {
        Thesis thesis = thesisRepository.findById(id).orElse(null);
        if (thesis == null)
            throw new Error("Không tìm thấy luận văn");
        thesis.setTimeSlot(null);
        thesis.setStatus("Chưa xếp lịch");
        return thesisRepository.save(thesis);
    }

    @Transactional
    public List<Thesis> autoScheduling(int defensePeriodId) {
        DefensePeriod defensePeriod = defensePeriodRepository.findById(defensePeriodId).orElse(null);
        if (defensePeriod == null)
            throw new Error("Không tìm thấy đợt bảo vệ");

        List<Thesis> theses = thesisRepository.findByStatus("Chưa xếp lịch");

        // Find all time slots in the defense period
        LocalDate startDate = defensePeriod.getStart().toLocalDate();
        LocalDate endDate = defensePeriod.getEnd().toLocalDate();
        List<TimeSlot> timeSlots = new ArrayList<>();
        while (!startDate.isAfter(endDate)) {
            List<TimeSlot> timeSlots1 = timeSlotRepository.findByDateOrderByIdAsc(startDate);
            timeSlots.addAll(timeSlots1);
            startDate = startDate.plusDays(1);
        }

        for (Thesis thesis : theses) {
            for (int i = timeSlots.size() - 1; i >= 0; i--) {
                TimeSlot timeSlot = timeSlots.get(i);

                // Check if there is a defense committee at this time slot
                if (timeSlot.getDefenseCommittee() == null)
                    continue;

                // Check if there is another thesis at this time slot
                Thesis thesis1 = thesisRepository.findByTimeSlot(timeSlot);
                if (thesis1 != null)
                    continue;

                List<CommitteeMember> committeeMembers = committeeMemberRepository.findByDefenseCommittee(timeSlot.getDefenseCommittee());
                for (CommitteeMember committeeMember : committeeMembers) {
                    // Check if the thesis's advisor is also the secretary of this defense committee
                    if (committeeMember.getCommitteeRole().getName().equals("Thư ký") && committeeMember.getLecturer().equals(thesis.getLecturer())) {
                        // Assign the time slot to the thesis if all cases are passed
                        thesis.setTimeSlot(timeSlot);
                        // Set thesis's status to scheduled
                        thesis.setStatus("Đã xếp lịch");
                    }
                }
            }
        }

        return thesisRepository.saveAll(theses);
    }

    @Transactional
    public List<Notification> publishSchedules(int defensePeriodId) {
        DefensePeriod defensePeriod = defensePeriodRepository.findById(defensePeriodId).orElse(null);
        if (defensePeriod == null)
            throw new Error("Không tìm thấy đợt bảo vệ");

        List<Thesis> theses = thesisRepository.findByStatus("Đã xếp lịch");
        List<Notification> notifications = new ArrayList<>();
        List<Lecturer> lecturers = lecturerRepository.findAll();

        for (Lecturer lecturer : lecturers) {
            List<ScheduledSessionDTO> scheduledSessions = new ArrayList<>();
            List<CommitteeMember> committeeMembers = committeeMemberRepository.findByLecturer(lecturer);
            // Check if the lecturer has not attended to any defense committees
            if (committeeMembers.isEmpty())
                continue;

            for (CommitteeMember committeeMember : committeeMembers) {
                DefenseCommittee defenseCommittee = committeeMember.getDefenseCommittee();
                // Check if the defense committee is in this defense period
                if (defenseCommittee.getDefensePeriod().equals(defensePeriod)) {
                    List<TimeSlot> timeSlots = timeSlotRepository.findByDefenseCommittee(defenseCommittee);
                    for (TimeSlot timeSlot : timeSlots) {
                        Thesis thesis = thesisRepository.findByTimeSlot(timeSlot);
                        // Check if the thesis does not exist
                        if (thesis == null)
                            continue;
                        ScheduledSessionDTO scheduledSessionDTO = new ScheduledSessionDTO();
                        scheduledSessionDTO.setDate(timeSlot.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                        scheduledSessionDTO.setStart(timeSlot.getStart());
                        scheduledSessionDTO.setDefenseCommittee(timeSlot.getDefenseCommittee());
                        scheduledSessionDTO.setStudentName(thesis.getStudent().getUser().getFullname());
                        scheduledSessionDTO.setCommitteeRoleName(committeeMember.getCommitteeRole().getName());
                        scheduledSessions.add(scheduledSessionDTO);
                    }
                }
            }

            // Check if scheduled sessions array is not empty
            if (!scheduledSessions.isEmpty()) {
                // Create a notification for the lecturer
                Notification notification = new Notification();
                notification.setUser(lecturer.getUser());
                notification.setTitle("Thông báo lịch tham gia hội đồng chấm LVTN cho đợt bảo vệ " + defensePeriod.getName());

                Context context = new Context();
                context.setVariable("lecturerFullName", lecturer.getUser().getFullname());
                context.setVariable("scheduledSessions", scheduledSessions);

                String htmlContent = templateEngine.process("emails/lecturer-schedule", context);
                notification.setContent(htmlContent);
                notification.setStatus("Đang xử lý");
                notification.setCreatedAt(LocalDateTime.now());
                notifications.add(notification);
            }
        }

        for (Thesis thesis : theses) {
            TimeSlot timeSlot = thesis.getTimeSlot();

            // Check if the time slot is in the defense period
            if (timeSlot.getDate().isBefore(defensePeriod.getStart().toLocalDate()) || timeSlot.getDate().isAfter(defensePeriod.getEnd().toLocalDate()))
                continue;

            // Check if there is a defense committee at this time slot
            if (timeSlot.getDefenseCommittee() == null)
                continue;

            List<CommitteeMember> committeeMembers = committeeMemberRepository.findByDefenseCommittee(timeSlot.getDefenseCommittee());
            // Create a notification for the thesis's student
            Notification notification1 = new Notification();
            notification1.setUser(thesis.getStudent().getUser());
            notification1.setTitle("Thông tin về buổi bảo vệ LVTN cho đề tài " + thesis.getTitle());

            Context context1 = new Context();
            context1.setVariable("studentFullName", thesis.getStudent().getUser().getFullname());
            context1.setVariable("thesisTitle", thesis.getTitle());
            context1.setVariable("sessionTime", timeSlot.getStart());
            context1.setVariable("sessionDate", timeSlot.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            context1.setVariable("locationName", timeSlot.getDefenseCommittee().getRoom().getName());
            context1.setVariable("committeeMembers", committeeMembers);

            String htmlContent1 = templateEngine.process("emails/student-schedule", context1);
            notification1.setContent(htmlContent1);
            notification1.setStatus("Đang xử lý");
            notification1.setCreatedAt(LocalDateTime.now());
            notifications.add(notification1);

            // Mark thesis is published
            thesis.setStatus("Đã công bố");
        }

        thesisRepository.saveAll(theses);
        return notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void deleteThesisById(int id) {
        Thesis thesis = thesisRepository.findById(id).orElse(null);
        if (thesis == null)
            throw new Error("Không tìm thấy luận văn");
        thesisRepository.deleteById(id);
    }
}
