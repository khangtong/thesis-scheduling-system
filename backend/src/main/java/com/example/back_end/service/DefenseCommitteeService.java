package com.example.back_end.service;

import com.example.back_end.dao.DefenseCommitteeRepository;
import com.example.back_end.dao.DefensePeriodRepository;
import com.example.back_end.dao.RoomRepository;
import com.example.back_end.dao.TimeSlotRepository;
import com.example.back_end.dto.DefenseCommitteeDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DefenseCommitteeService {
    private DefenseCommitteeRepository defenseCommitteeRepository;
    private DefensePeriodRepository defensePeriodRepository;
    private TimeSlotRepository timeSlotRepository;
    private RoomRepository roomRepository;

    @Autowired
    public DefenseCommitteeService(DefenseCommitteeRepository defenseCommitteeRepository, DefensePeriodRepository defensePeriodRepository, TimeSlotRepository timeSlotRepository, RoomRepository roomRepository) {
        this.defenseCommitteeRepository = defenseCommitteeRepository;
        this.defensePeriodRepository = defensePeriodRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.roomRepository = roomRepository;
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

    @Transactional
    public DefenseCommittee createDefenseCommittee(DefenseCommitteeDTO defenseCommitteeDTO) {
        DefenseCommittee defenseCommittee = new DefenseCommittee();
        if ("".equals(defenseCommitteeDTO.getName()))
            throw new Error("Tên hội đồng không được là rỗng");
        defenseCommittee.setName(defenseCommitteeDTO.getName());

        if (defenseCommitteeDTO.getDefensePeriodId() != null) {
            DefensePeriod defensePeriod = defensePeriodRepository.findById(defenseCommitteeDTO.getDefensePeriodId()).orElse(null);
            if (defensePeriod == null)
                throw new Error("Không tìm thấy đợt bảo vệ");
            defenseCommittee.setDefensePeriod(defensePeriod);
        }

        if (defenseCommitteeDTO.getTimeSlotId() != null) {
            TimeSlot timeSlot = timeSlotRepository.findById(defenseCommitteeDTO.getTimeSlotId()).orElse(null);
            if (timeSlot == null)
                throw new Error("Không tìm thấy khung giờ");
            defenseCommittee.setTimeSlot(timeSlot);
        }

        if (defenseCommitteeDTO.getRoomId() != null) {
            Room room = roomRepository.findById(defenseCommitteeDTO.getRoomId()).orElse(null);
            if (room == null)
                throw new Error("Không tìm thấy phòng");
            defenseCommittee.setRoom(room);
        }

        defenseCommittee.setCreatedAt(LocalDateTime.now());
        defenseCommittee.setUpdatedAt(LocalDateTime.now());
        return defenseCommitteeRepository.save(defenseCommittee);
    }

    @Transactional
    public DefenseCommittee updateDefenseCommitteeById(int id, DefenseCommitteeDTO defenseCommitteeDTO) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");

        if ("".equals(defenseCommitteeDTO.getName()))
            throw new Error("Tên hội đồng không được là rỗng");
        defenseCommittee.setName(defenseCommitteeDTO.getName());

        if (defenseCommitteeDTO.getDefensePeriodId() != null) {
            DefensePeriod defensePeriod = defensePeriodRepository.findById(defenseCommitteeDTO.getDefensePeriodId()).orElse(null);
            if (defensePeriod == null)
                throw new Error("Không tìm thấy đợt bảo vệ");
            defenseCommittee.setDefensePeriod(defensePeriod);
        } else {
            throw new Error("Đợt bảo vệ không được là rỗng");
        }

        if (defenseCommitteeDTO.getTimeSlotId() != null) {
            TimeSlot timeSlot = timeSlotRepository.findById(defenseCommitteeDTO.getTimeSlotId()).orElse(null);
            if (timeSlot == null)
                throw new Error("Không tìm thấy khung giờ");
            defenseCommittee.setTimeSlot(timeSlot);
        } else {
            throw new Error("Khung giờ không được là rỗng");
        }

        if (defenseCommitteeDTO.getRoomId() != null) {
            Room room = roomRepository.findById(defenseCommitteeDTO.getRoomId()).orElse(null);
            if (room == null)
                throw new Error("Không tìm thấy phòng");
            defenseCommittee.setRoom(room);
        } else {
            throw new Error("Phòng không được là rỗng");
        }

        defenseCommittee.setUpdatedAt(LocalDateTime.now());
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
