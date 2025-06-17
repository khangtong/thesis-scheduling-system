package com.example.back_end.service;

import com.example.back_end.dao.DefensePeriodRepository;
import com.example.back_end.dao.DefenseSessionRepository;
import com.example.back_end.dao.RoomRepository;
import com.example.back_end.dao.TimeSlotRepository;
import com.example.back_end.dto.DefenseSessionDTO;
import com.example.back_end.dto.LecturerDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DefenseSessionService {
    private DefenseSessionRepository defenseSessionRepository;
    private TimeSlotRepository timeSlotRepository;
    private RoomRepository roomRepository;
    private DefensePeriodRepository defensePeriodRepository;

    @Autowired
    public DefenseSessionService(DefenseSessionRepository defenseSessionRepository, TimeSlotRepository timeSlotRepository, RoomRepository roomRepository, DefensePeriodRepository defensePeriodRepository) {
        this.defenseSessionRepository = defenseSessionRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.roomRepository = roomRepository;
        this.defensePeriodRepository = defensePeriodRepository;
    }

    @Transactional(readOnly = true)
    public List<DefenseSession> getAllDefenseSessions() {
        return defenseSessionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public DefenseSession getDefenseSessionById(int id) {
        DefenseSession defenseSession = defenseSessionRepository.findById(id).orElse(null);
        if (defenseSession == null)
            throw new Error("Không tìm thấy buổi bảo vệ");
        return defenseSession;
    }

    @Transactional
    public DefenseSession createDefenseSession(DefenseSessionDTO defenseSessionDTO) {
        DefenseSession defenseSession = new DefenseSession();

        if ("".equals(defenseSessionDTO.getStatus()))
            throw new Error("Trạng thái không được là rỗng");
        defenseSession.setStatus(defenseSessionDTO.getStatus());

        if (defenseSessionDTO.getTimeSlotId() != null) {
            TimeSlot timeSlot = timeSlotRepository.findById(defenseSessionDTO.getTimeSlotId()).orElse(null);
            if (timeSlot == null)
                throw new Error("Không tìm thấy khung giờ");
            defenseSession.setTimeSlot(timeSlot);
        } else {
            throw new Error("Khung giờ không được là rỗng");
        }

        if (defenseSessionDTO.getRoomId() != null) {
            Room room = roomRepository.findById(defenseSessionDTO.getRoomId()).orElse(null);
            if (room == null)
                throw new Error("Không tìm thấy phòng");
            defenseSession.setRoom(room);
        } else {
            throw new Error("Phòng không được là rỗng");
        }

        if (defenseSessionDTO.getDefensePeriodId() != null) {
            DefensePeriod defensePeriod = defensePeriodRepository.findById(defenseSessionDTO.getDefensePeriodId()).orElse(null);
            if (defensePeriod == null)
                throw new Error("Không tìm thấy đợt bảo vệ");
            defenseSession.setDefensePeriod(defensePeriod);
        } else  {
            throw new Error("Đợt bảo vệ không được là rỗng");
        }

        defenseSession.setNote(defenseSessionDTO.getNote());
        defenseSession.setCreatedAt(LocalDateTime.now());
        defenseSession.setUpdatedAt(LocalDateTime.now());
        return defenseSessionRepository.save(defenseSession);
    }

    @Transactional
    public DefenseSession updateDefenseSessionById(int id, DefenseSessionDTO defenseSessionDTO) {
        DefenseSession defenseSession = defenseSessionRepository.findById(id).orElse(null);
        if (defenseSession == null)
            throw new Error("Không tìm thấy buổi bảo vệ");

        if ("".equals(defenseSessionDTO.getStatus()))
            throw new Error("Trạng thái không được là rỗng");
        defenseSession.setStatus(defenseSessionDTO.getStatus());

        if (defenseSessionDTO.getTimeSlotId() != null) {
            TimeSlot timeSlot = timeSlotRepository.findById(defenseSessionDTO.getTimeSlotId()).orElse(null);
            if (timeSlot == null)
                throw new Error("Không tìm thấy khung giờ");
            defenseSession.setTimeSlot(timeSlot);
        } else {
            throw new Error("Khung giờ không được là rỗng");
        }

        if (defenseSessionDTO.getRoomId() != null) {
            Room room = roomRepository.findById(defenseSessionDTO.getRoomId()).orElse(null);
            if (room == null)
                throw new Error("Không tìm thấy phòng");
            defenseSession.setRoom(room);
        } else {
            throw new Error("Phòng không được là rỗng");
        }

        if (defenseSessionDTO.getDefensePeriodId() != null) {
            DefensePeriod defensePeriod = defensePeriodRepository.findById(defenseSessionDTO.getDefensePeriodId()).orElse(null);
            if (defensePeriod == null)
                throw new Error("Không tìm thấy đợt bảo vệ");
            defenseSession.setDefensePeriod(defensePeriod);
        } else  {
            throw new Error("Đợt bảo vệ không được là rỗng");
        }

        defenseSession.setNote(defenseSessionDTO.getNote());
        defenseSession.setUpdatedAt(LocalDateTime.now());
        return defenseSessionRepository.save(defenseSession);
    }

    @Transactional
    public void deleteDefenseSessionById(int id) {
        DefenseSession defenseSession = defenseSessionRepository.findById(id).orElse(null);
        if (defenseSession == null)
            throw new Error("Không tìm thấy buổi bảo vệ");
        defenseSessionRepository.deleteById(id);
    }
}
