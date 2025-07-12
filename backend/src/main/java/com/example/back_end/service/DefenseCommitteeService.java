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

    @Autowired
    public DefenseCommitteeService(DefenseCommitteeRepository defenseCommitteeRepository, DefensePeriodRepository defensePeriodRepository, TimeSlotRepository timeSlotRepository, RoomRepository roomRepository, LecturerRepository lecturerRepository, CommitteeRoleRepository committeeRoleRepository, CommitteeMemberRepository committeeMemberRepository) {
        this.defenseCommitteeRepository = defenseCommitteeRepository;
        this.defensePeriodRepository = defensePeriodRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.roomRepository = roomRepository;
        this.lecturerRepository = lecturerRepository;
        this.committeeRoleRepository = committeeRoleRepository;
        this.committeeMemberRepository = committeeMemberRepository;
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

        if (defenseCommitteeDTO.getRoomId() != null) {
            Room room = roomRepository.findById(defenseCommitteeDTO.getRoomId()).orElse(null);
            if (room == null)
                throw new Error("Không tìm thấy phòng");
            defenseCommittee.setRoom(room);
        }
        defenseCommittee.setCreatedAt(LocalDateTime.now());
        defenseCommittee.setUpdatedAt(LocalDateTime.now());
        DefenseCommittee dbDefenseCommittee = defenseCommitteeRepository.save(defenseCommittee);

        List<CommitteeMember> committeeMembers = new ArrayList<>();
        List<Lecturer> lecturers = new ArrayList<>();
        List<CommitteeRole> committeeRoles = new ArrayList<>();
        if (defenseCommitteeDTO.getLecturerIds() != null) {
            for (int i = 0; i < defenseCommitteeDTO.getLecturerIds().size(); i++) {
                int id = defenseCommitteeDTO.getLecturerIds().get(i);
                Lecturer lecturer = lecturerRepository.findById(id).orElse(null);
                if (lecturer == null)
                    throw new Error("Không tìm thấy giảng viên");
                lecturers.add(lecturer);
            }
        }

        if (defenseCommitteeDTO.getCommitteeRoleIds() != null) {
            for (int i = 0; i < defenseCommitteeDTO.getCommitteeRoleIds().size(); i++) {
                int id = defenseCommitteeDTO.getCommitteeRoleIds().get(i);
                CommitteeRole committeeRole = committeeRoleRepository.findById(id).orElse(null);
                if (committeeRole == null)
                    throw new Error("Không tìm thấy vai trò hội đồng");
                committeeRoles.add(committeeRole);
            }
        }

        for (int i = 0; i < defenseCommitteeDTO.getCommitteeRoleIds().size(); i++) {
            committeeMembers.add(new CommitteeMember(null, dbDefenseCommittee, lecturers.get(i), committeeRoles.get(i)));
        }
        committeeMemberRepository.saveAll(committeeMembers);

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

        if (defenseCommitteeDTO.getDefensePeriodId() != null) {
            DefensePeriod defensePeriod = defensePeriodRepository.findById(defenseCommitteeDTO.getDefensePeriodId()).orElse(null);
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
        DefenseCommittee dbDefenseCommittee = defenseCommitteeRepository.save(defenseCommittee);

        List<CommitteeMember> committeeMembers = committeeMemberRepository.findByDefenseCommittee(dbDefenseCommittee);
        List<Lecturer> lecturers = new ArrayList<>();
        List<CommitteeRole> committeeRoles = new ArrayList<>();
        if (defenseCommitteeDTO.getLecturerIds() != null) {
            for (int i = 0; i < defenseCommitteeDTO.getLecturerIds().size(); i++) {
                int lecturerId = defenseCommitteeDTO.getLecturerIds().get(i);
                Lecturer lecturer = lecturerRepository.findById(lecturerId).orElse(null);
                if (lecturer == null)
                    throw new Error("Không tìm thấy giảng viên");
                lecturers.add(lecturer);
            }
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

        for (int i = 0; i < committeeMembers.size(); i++) {
            CommitteeMember committeeMember = committeeMembers.get(i);
            committeeMember.setDefenseCommittee(dbDefenseCommittee);
            committeeMember.setLecturer(lecturers.get(i));
            committeeMember.setCommitteeRole(committeeRoles.get(i));
        }
        committeeMemberRepository.saveAll(committeeMembers);

        return dbDefenseCommittee;
    }

    @Transactional
    public void deleteDefenseCommitteeById(int id) {
        DefenseCommittee defenseCommittee = defenseCommitteeRepository.findById(id).orElse(null);
        if (defenseCommittee == null)
            throw new Error("Không tìm thấy hội đồng");
        defenseCommitteeRepository.deleteById(id);
    }
}
