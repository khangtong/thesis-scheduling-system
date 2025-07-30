package com.example.back_end.service;

import com.example.back_end.dao.*;
import com.example.back_end.dto.TimeSlotDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TimeSlotService {
    private TimeSlotRepository timeSlotRepository;
    private DefensePeriodRepository defensePeriodRepository;
    private DefenseCommitteeRepository defenseCommitteeRepository;
    private CommitteeMemberRepository committeeMemberRepository;
    private PriorityScheduleRepository priorityScheduleRepository;

    @Autowired
    public TimeSlotService(TimeSlotRepository timeSlotRepository, DefensePeriodRepository defensePeriodRepository, DefenseCommitteeRepository defenseCommitteeRepository, CommitteeMemberRepository committeeMemberRepository, PriorityScheduleRepository priorityScheduleRepository) {
        this.timeSlotRepository = timeSlotRepository;
        this.defensePeriodRepository = defensePeriodRepository;
        this.defenseCommitteeRepository = defenseCommitteeRepository;
        this.committeeMemberRepository = committeeMemberRepository;
        this.priorityScheduleRepository = priorityScheduleRepository;
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> getAllTimeSlots() {
        return timeSlotRepository.findAllByOrderByIdAsc();
    }

    @Transactional(readOnly = true)
    public TimeSlot getTimeSlotById(int id) {
        TimeSlot timeSlot = timeSlotRepository.findById(id).orElse(null);
        if (timeSlot == null)
            throw new Error("Không tìm thấy khung giờ");
        return timeSlot;
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> getTimeSlotsByDateRange(LocalDate startDate, LocalDate endDate) {
        List<TimeSlot> timeSlots = new ArrayList<>();
        while (!startDate.isAfter(endDate)) {
            List<TimeSlot> timeSlots1 = timeSlotRepository.findByDate(startDate);
            timeSlots.addAll(timeSlots1);
            startDate = startDate.plusDays(1);
        }
        return timeSlots;
    }

    @Transactional
    public List<TimeSlot> createTimeSlot(TimeSlotDTO timeSlotDTO) {
        DefensePeriod defensePeriod = defensePeriodRepository.findById(timeSlotDTO.getDefensePeriodId()).orElse(null);
        if (defensePeriod == null)
            throw new Error("Không tìm thấy đợt bảo vệ");
        if (!defensePeriod.isActive())
            throw new Error("Đợt bảo vệ không hoạt động");

        LocalDateTime start = defensePeriod.getStart();
        LocalDateTime end = defensePeriod.getEnd();
        LocalTime endMorning = timeSlotDTO.getEndMorningPhase();
        LocalTime endAfternoon = timeSlotDTO.getEndAfternoonPhase();
        int timeLength = timeSlotDTO.getTimeLength();
        List<TimeSlot> timeSlots = new ArrayList<>();

        while (!start.isAfter(end)) {
            LocalTime startMorning = timeSlotDTO.getStartMorningPhase();
            LocalTime startAfternoon = timeSlotDTO.getStartAfternoonPhase();
            if (startMorning != null && endMorning != null) {
                while (startMorning.isBefore(endMorning)) {
                    TimeSlot timeSlot = new TimeSlot(null, start.toLocalDate(), startMorning, startMorning.plusMinutes(timeLength));
                    timeSlots.add(timeSlot);
                    startMorning = startMorning.plusMinutes(timeLength);
                }
            }
            if (startAfternoon != null && endAfternoon != null) {
                while (startAfternoon.isBefore(endAfternoon)) {
                    TimeSlot timeSlot = new TimeSlot(null, start.toLocalDate(), startAfternoon, startAfternoon.plusMinutes(timeLength));
                    timeSlots.add(timeSlot);
                    startAfternoon = startAfternoon.plusMinutes(timeLength);
                }
            }
            start = start.plusDays(1);
        }

        return timeSlotRepository.saveAll(timeSlots);
    }

    @Transactional
    public TimeSlot updateTimeSlotById(int id, TimeSlotDTO timeSlotDTO) {
        TimeSlot dbTimeSlot = timeSlotRepository.findById(id).orElse(null);
        if (dbTimeSlot == null)
            throw new Error("Không tìm thấy khung giờ");

        if (timeSlotDTO.getDate() == null)
            throw new Error("Ngày không được là rỗng");
        dbTimeSlot.setDate(timeSlotDTO.getDate());

        if (timeSlotDTO.getStart() == null)
            throw new Error("Thời gian bắt đầu không được là rỗng");

        if (timeSlotDTO.getEnd() == null)
            throw new Error("Thời gian kết thúc không được là rỗng");

        if (timeSlotDTO.getStart().isAfter(timeSlotDTO.getEnd()))
            throw new Error("Thời gian bắt đầu và kết thúc không hợp lệ");

        dbTimeSlot.setStart(timeSlotDTO.getStart());
        dbTimeSlot.setEnd(timeSlotDTO.getEnd());

        return timeSlotRepository.save(dbTimeSlot);
    }

    @Transactional
    public void deleteTimeSlotById(int id) {
        TimeSlot timeSlot = timeSlotRepository.findById(id).orElse(null);
        if (timeSlot == null)
            throw new Error("Không tìm thấy khung giờ");
        timeSlotRepository.deleteById(id);
    }
}
