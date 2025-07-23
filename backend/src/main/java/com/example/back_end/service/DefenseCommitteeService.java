package com.example.back_end.service;

import com.example.back_end.dao.*;
import com.example.back_end.dto.DefenseCommitteeDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DefenseCommitteeService {
    private DefenseCommitteeRepository defenseCommitteeRepository;
    private DefensePeriodRepository defensePeriodRepository;
    private TimeSlotRepository timeSlotRepository;
    private RoomRepository roomRepository;
    private LecturerRepository lecturerRepository;
    private CommitteeRoleRepository committeeRoleRepository;
    private CommitteeMemberRepository committeeMemberRepository;
    private PriorityScheduleRepository priorityScheduleRepository;

    @Autowired
    public DefenseCommitteeService(DefenseCommitteeRepository defenseCommitteeRepository, DefensePeriodRepository defensePeriodRepository, TimeSlotRepository timeSlotRepository, RoomRepository roomRepository, LecturerRepository lecturerRepository, CommitteeRoleRepository committeeRoleRepository, CommitteeMemberRepository committeeMemberRepository, PriorityScheduleRepository priorityScheduleRepository) {
        this.defenseCommitteeRepository = defenseCommitteeRepository;
        this.defensePeriodRepository = defensePeriodRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.roomRepository = roomRepository;
        this.lecturerRepository = lecturerRepository;
        this.committeeRoleRepository = committeeRoleRepository;
        this.committeeMemberRepository = committeeMemberRepository;
        this.priorityScheduleRepository = priorityScheduleRepository;
    }

    @Transactional(readOnly = true)
    public List<DefenseCommittee> getAllDefenseCommittees() {
        return defenseCommitteeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public DefenseCommittee getDefenseCommitteeById(int id) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");
        return defenseCommittee;
    }

    @Transactional(readOnly = true)
    public List<DefenseCommittee> getDefenseCommitteesByLecturer(User user) {
        Lecturer lecturer = lecturerRepository.findByUser(user);
        if (lecturer == null)
            throw new Error("Không tìm thấy giảng viên");

        List<CommitteeMember> committeeMembers = committeeMemberRepository.findByLecturer(lecturer);
        List<DefenseCommittee> defenseCommittees = new ArrayList<>();
        for (CommitteeMember committeeMember : committeeMembers)
            defenseCommittees.add(committeeMember.getDefenseCommittee());

        return defenseCommittees;
    }

    @Transactional
    public DefenseCommittee createDefenseCommittee(DefenseCommitteeDTO defenseCommitteeDTO) {
        // Create defense committee
        DefenseCommittee defenseCommittee = new DefenseCommittee();
        if ("".equals(defenseCommitteeDTO.getName()))
            throw new Error("Tên hội đồng không được là rỗng");
        defenseCommittee.setName(defenseCommitteeDTO.getName());

        DefensePeriod defensePeriod;
        if (defenseCommitteeDTO.getDefensePeriodId() != null) {
            defensePeriod = defensePeriodRepository.findById(defenseCommitteeDTO.getDefensePeriodId()).orElse(null);
            if (defensePeriod == null)
                throw new Error("Không tìm thấy đợt bảo vệ");
            defenseCommittee.setDefensePeriod(defensePeriod);
        } else {
            throw new Error("Đợt bảo vệ không được là rỗng");
        }

        if (defenseCommitteeDTO.getRoomId() != null) {
            Room room = roomRepository.findById(defenseCommitteeDTO.getRoomId()).orElse(null);
            if (room == null)
                throw new Error("Không tìm thấy phòng");
            defenseCommittee.setRoom(room);
        }
        defenseCommittee.setCreatedAt(LocalDateTime.now());
        defenseCommittee.setUpdatedAt(LocalDateTime.now());

        // Create committee members for the defense committee
        List<CommitteeMember> committeeMembers = new ArrayList<>();
        List<Lecturer> lecturers = new ArrayList<>();
        List<CommitteeRole> committeeRoles = new ArrayList<>();
        List<TimeSlot> timeSlots = new ArrayList<>();
        if (defenseCommitteeDTO.getLecturerIds() != null && !defenseCommitteeDTO.getLecturerIds().isEmpty()) {
            if (defenseCommitteeDTO.getTimeSlotIds() != null && !defenseCommitteeDTO.getTimeSlotIds().isEmpty()) {
                for (int i = 0; i < defenseCommitteeDTO.getLecturerIds().size(); i++) {
                    int id = defenseCommitteeDTO.getLecturerIds().get(i);
                    Lecturer lecturer = lecturerRepository.findById(id).orElse(null);
                    if (lecturer == null)
                        throw new Error("Không tìm thấy giảng viên");
                    // Get priority schedules of a lecturer and compare with time slots
                    List<PrioritySchedule> prioritySchedules = priorityScheduleRepository.findByLecturer(lecturer);
                    for (int j = 0; j < defenseCommitteeDTO.getTimeSlotIds().size(); j++) {
                        int timeSlotId = defenseCommitteeDTO.getTimeSlotIds().get(j);
                        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId).orElse(null);
                        if (timeSlot == null)
                            throw new Error("Không tìm thấy khung giờ");
                        // Check if there is another defense committee at this time slot
                        if (timeSlot.getDefenseCommittee() != null)
                            throw new Error("Khung giờ " + timeSlot.getStart() + " - " + timeSlot.getEnd() + " ngày " + timeSlot.getDate() + " đã có một hội đồng khác");
                        // Check if priority schedules is empty
                        if (prioritySchedules.isEmpty()) {
                            timeSlots.add(timeSlot);
                        } else {
                            for (PrioritySchedule prioritySchedule : prioritySchedules) {
                                // Check if the lecturer is available at a time slot
                                if (!prioritySchedule.getTimeSlot().equals(timeSlot)) {
                                    // Check if the time slot is in the defense period
                                    if (prioritySchedule.getTimeSlot().getDate().isBefore(defensePeriod.getStart().toLocalDate()) || prioritySchedule.getTimeSlot().getDate().isAfter(defensePeriod.getEnd().toLocalDate()))
                                        timeSlots.add(timeSlot);
                                } else
                                    throw new Error("Giảng viên " + lecturer.getUser().getFullname() + " đã bận vào khung giờ " + timeSlot.getDate() + " (" + timeSlot.getStart() + " - " + timeSlot.getEnd() + ")");
                            }
                        }
                    }
                    lecturers.add(lecturer);
                }
            } else {
                throw new Error("Khung giờ không hợp lệ");
            }
        } else {
            throw new Error("Thành viên hội đồng không hợp lệ");
        }

        // Check if all committee roles are exist
        if (defenseCommitteeDTO.getCommitteeRoleIds() != null) {
            for (int i = 0; i < defenseCommitteeDTO.getCommitteeRoleIds().size(); i++) {
                int id = defenseCommitteeDTO.getCommitteeRoleIds().get(i);
                CommitteeRole committeeRole = committeeRoleRepository.findById(id).orElse(null);
                if (committeeRole == null)
                    throw new Error("Không tìm thấy vai trò hội đồng");
                committeeRoles.add(committeeRole);
            }
        } else {
            throw new Error("Vai trò hội đồng không hợp lệ");
        }

        // Create committee members with lecturers and committee roles
        DefenseCommittee dbDefenseCommittee = defenseCommitteeRepository.save(defenseCommittee);
        for (int i = 0; i < defenseCommitteeDTO.getCommitteeRoleIds().size(); i++) {
            committeeMembers.add(new CommitteeMember(null, dbDefenseCommittee, lecturers.get(i), committeeRoles.get(i)));
        }
        committeeMemberRepository.saveAll(committeeMembers);

        // Update defense committee foreign key for each time slot
        for (TimeSlot timeSlot : timeSlots) {
            timeSlot.setDefenseCommittee(dbDefenseCommittee);
        }
        timeSlotRepository.saveAll(timeSlots);

        return dbDefenseCommittee;
    }

    @Transactional
    public DefenseCommittee updateDefenseCommitteeById(int id, DefenseCommitteeDTO defenseCommitteeDTO) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");

        if ("".equals(defenseCommitteeDTO.getName()))
            throw new Error("Tên hội đồng không được là rỗng");
        defenseCommittee.setName(defenseCommitteeDTO.getName());

        DefensePeriod defensePeriod;
        if (defenseCommitteeDTO.getDefensePeriodId() != null) {
            defensePeriod = defensePeriodRepository.findById(defenseCommitteeDTO.getDefensePeriodId()).orElse(null);
            if (defensePeriod == null)
                throw new Error("Không tìm thấy đợt bảo vệ");
            defenseCommittee.setDefensePeriod(defensePeriod);
        } else {
            throw new Error("Đợt bảo vệ không được là rỗng");
        }

        if (defenseCommitteeDTO.getRoomId() != null) {
            Room room = roomRepository.findById(defenseCommitteeDTO.getRoomId()).orElse(null);
            if (room == null)
                throw new Error("Không tìm thấy phòng");
            defenseCommittee.setRoom(room);
        }
        defenseCommittee.setUpdatedAt(LocalDateTime.now());

        List<Lecturer> lecturers = new ArrayList<>();
        List<CommitteeRole> committeeRoles = new ArrayList<>();
        List<TimeSlot> timeSlots = new ArrayList<>();
        if (defenseCommitteeDTO.getLecturerIds() != null && !defenseCommitteeDTO.getLecturerIds().isEmpty()) {
            if (defenseCommitteeDTO.getTimeSlotIds() != null && !defenseCommitteeDTO.getTimeSlotIds().isEmpty()) {
                for (int i = 0; i < defenseCommitteeDTO.getLecturerIds().size(); i++) {
                    int lecturerId = defenseCommitteeDTO.getLecturerIds().get(i);
                    Lecturer lecturer = lecturerRepository.findById(lecturerId).orElse(null);
                    if (lecturer == null)
                        throw new Error("Không tìm thấy giảng viên");
                    // Get priority schedules of a lecturer and compare with time slots
                    List<PrioritySchedule> prioritySchedules = priorityScheduleRepository.findByLecturer(lecturer);
                    for (int j = 0; j < defenseCommitteeDTO.getTimeSlotIds().size(); j++) {
                        int timeSlotId = defenseCommitteeDTO.getTimeSlotIds().get(j);
                        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId).orElse(null);
                        if (timeSlot == null)
                            throw new Error("Không tìm thấy khung giờ");
                        // Check if there is another defense committee at this time slot
                        if (timeSlot.getDefenseCommittee() != null)
                            throw new Error("Khung giờ " + timeSlot.getStart() + " - " + timeSlot.getEnd() + " ngày " + timeSlot.getDate() + " đã có một hội đồng khác");
                        // Check if priority schedules is empty
                        if (prioritySchedules.isEmpty()) {
                            timeSlots.add(timeSlot);
                        } else {
                            for (PrioritySchedule prioritySchedule : prioritySchedules) {
                                // Check if the lecturer is available at a time slot
                                if (!prioritySchedule.getTimeSlot().equals(timeSlot)) {
                                    // Check if the time slot is in the defense period
                                    if (prioritySchedule.getTimeSlot().getDate().isBefore(defensePeriod.getStart().toLocalDate()) || prioritySchedule.getTimeSlot().getDate().isAfter(defensePeriod.getEnd().toLocalDate()))
                                        timeSlots.add(timeSlot);
                                } else
                                    throw new Error("Giảng viên " + lecturer.getUser().getFullname() + " đã bận vào khung giờ " + timeSlot.getDate() + " (" + timeSlot.getStart() + " - " + timeSlot.getEnd() + ")");
                            }
                        }
                    }
                    lecturers.add(lecturer);
                }
            } else {
                throw new Error("Khung giờ không hợp lệ");
            }
        } else {
            throw new Error("Thành viên hội đồng không hợp lệ");
        }

        if (defenseCommitteeDTO.getCommitteeRoleIds() != null) {
            for (int i = 0; i < defenseCommitteeDTO.getCommitteeRoleIds().size(); i++) {
                int committeeRoleId = defenseCommitteeDTO.getCommitteeRoleIds().get(i);
                CommitteeRole committeeRole = committeeRoleRepository.findById(committeeRoleId).orElse(null);
                if (committeeRole == null)
                    throw new Error("Không tìm thấy vai trò hội đồng");
                committeeRoles.add(committeeRole);
            }
        }

        List<CommitteeMember> newCommitteeMembers = new ArrayList<>();
        for (int i = 0; i < defenseCommitteeDTO.getCommitteeRoleIds().size(); i++) {
            CommitteeMember committeeMember = new CommitteeMember(null, defenseCommittee, lecturers.get(i), committeeRoles.get(i));
            newCommitteeMembers.add(committeeMember);
        }
        committeeMemberRepository.saveAll(newCommitteeMembers);

        // Set all time slots of defense committee to null before setting new ones
        List<TimeSlot> dbTimeSlots = timeSlotRepository.findByDefenseCommittee(defenseCommittee);
        for (TimeSlot timeSlot : dbTimeSlots) {
            timeSlot.setDefenseCommittee(null);
        }
        timeSlotRepository.saveAll(dbTimeSlots);

        for (TimeSlot timeSlot : timeSlots) {
            timeSlot.setDefenseCommittee(defenseCommittee);
        }
        timeSlotRepository.saveAll(timeSlots);

        return defenseCommitteeRepository.save(defenseCommittee);
    }

    @Transactional
    public void deleteDefenseCommitteeById(int id) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");
        defenseCommitteeRepository.deleteById(id);
    }
}
