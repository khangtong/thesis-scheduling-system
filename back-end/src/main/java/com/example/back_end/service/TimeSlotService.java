package com.example.back_end.service;

import com.example.back_end.dao.TimeSlotRepository;
import com.example.back_end.entity.DefensePeriod;
import com.example.back_end.entity.TimeSlot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TimeSlotService {
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    public TimeSlotService(TimeSlotRepository timeSlotRepository) {
        this.timeSlotRepository = timeSlotRepository;
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> getAllTimeSlots() {
        return timeSlotRepository.findAll();
    }

    @Transactional(readOnly = true)
    public TimeSlot getTimeSlotById(int id) {
        TimeSlot timeSlot = timeSlotRepository.findById(id).orElse(null);
        if (timeSlot == null)
            throw new Error("Không tìm thấy khung giờ");
        return timeSlot;
    }

    @Transactional
    public TimeSlot createTimeSlot(TimeSlot timeSlot) {
        TimeSlot newTimeSlot = new TimeSlot();

        if (timeSlot.getDate() == null)
            throw new Error("Ngày không được là rỗng");
        newTimeSlot.setDate(timeSlot.getDate());

        if (timeSlot.getStart() == null)
            throw new Error("Thời gian bắt đầu không được là rỗng");

        if (timeSlot.getEnd() == null)
            throw new Error("Thời gian kết thúc không được là rỗng");

        if (timeSlot.getStart().isAfter(timeSlot.getEnd()))
            throw new Error("Thời gian bắt đầu và kết thúc không hợp lệ");

        newTimeSlot.setStart(timeSlot.getStart());
        newTimeSlot.setEnd(timeSlot.getEnd());
        return timeSlotRepository.save(newTimeSlot);
    }

    @Transactional
    public TimeSlot updateTimeSlotById(int id, TimeSlot timeSlot) {
        TimeSlot dbTimeSlot = timeSlotRepository.findById(id).orElse(null);
        if (timeSlot == null)
            throw new Error("Không tìm thấy khung giờ");

        if (timeSlot.getDate() == null)
            throw new Error("Ngày không được là rỗng");
        dbTimeSlot.setDate(timeSlot.getDate());

        if (timeSlot.getStart() == null)
            throw new Error("Thời gian bắt đầu không được là rỗng");

        if (timeSlot.getEnd() == null)
            throw new Error("Thời gian kết thúc không được là rỗng");

        if (timeSlot.getStart().isAfter(timeSlot.getEnd()))
            throw new Error("Thời gian bắt đầu và kết thúc không hợp lệ");

        dbTimeSlot.setStart(timeSlot.getStart());
        dbTimeSlot.setEnd(timeSlot.getEnd());
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
