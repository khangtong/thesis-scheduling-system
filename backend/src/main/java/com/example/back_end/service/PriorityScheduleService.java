package com.example.back_end.service;

import com.example.back_end.dao.LecturerRepository;
import com.example.back_end.dao.PriorityScheduleRepository;
import com.example.back_end.dao.TimeSlotRepository;
import com.example.back_end.dto.LecturerExpertiseDTO;
import com.example.back_end.dto.PriorityScheduleDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PriorityScheduleService {
    private PriorityScheduleRepository priorityScheduleRepository;
    private LecturerRepository lecturerRepository;
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    public PriorityScheduleService(PriorityScheduleRepository priorityScheduleRepository, LecturerRepository lecturerRepository, TimeSlotRepository timeSlotRepository) {
        this.priorityScheduleRepository = priorityScheduleRepository;
        this.lecturerRepository = lecturerRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    @Transactional(readOnly = true)
    public List<PrioritySchedule> getAllPrioritySchedules() {
        return priorityScheduleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public PrioritySchedule getPriorityScheduleById(int id) {
        PrioritySchedule prioritySchedule = priorityScheduleRepository.findById(id).orElse(null);
        if (prioritySchedule == null)
            throw new Error("Không tìm thấy lịch ưu tiên");
        return prioritySchedule;
    }

    @Transactional(readOnly = true)
    public List<PrioritySchedule> getPrioritySchedulesByLecturer(PriorityScheduleDTO priorityScheduleDTO) {
        List<PrioritySchedule> prioritySchedules;

        if (priorityScheduleDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(priorityScheduleDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            prioritySchedules = priorityScheduleRepository.findByLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        return prioritySchedules;
    }

    @Transactional
    public PrioritySchedule createPrioritySchedule(PriorityScheduleDTO priorityScheduleDTO) {
        PrioritySchedule newPrioritySchedule = new PrioritySchedule();

        if (priorityScheduleDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(priorityScheduleDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            newPrioritySchedule.setLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        if (priorityScheduleDTO.getTimeSlotId() != null) {
            TimeSlot timeSlot = timeSlotRepository.findById(priorityScheduleDTO.getTimeSlotId()).orElse(null);
            if (timeSlot == null)
                throw new Error("Không tìm thấy khung giờ");
            newPrioritySchedule.setTimeSlot(timeSlot);
        } else {
            throw new Error("Khung giờ không được là rỗng");
        }

        return priorityScheduleRepository.save(newPrioritySchedule);
    }

    @Transactional
    public PrioritySchedule updatePriorityScheduleById(int id, PriorityScheduleDTO priorityScheduleDTO) {
        PrioritySchedule prioritySchedule = priorityScheduleRepository.findById(id).orElse(null);
        if (prioritySchedule == null)
            throw new Error("Không tìm thấy lịch ưu tiên");

        if (priorityScheduleDTO.getLecturerId() != null) {
            Lecturer lecturer = lecturerRepository.findById(priorityScheduleDTO.getLecturerId()).orElse(null);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            prioritySchedule.setLecturer(lecturer);
        } else {
            throw new Error("Giảng viên không được là rỗng");
        }

        if (priorityScheduleDTO.getTimeSlotId() != null) {
            TimeSlot timeSlot = timeSlotRepository.findById(priorityScheduleDTO.getTimeSlotId()).orElse(null);
            if (timeSlot == null)
                throw new Error("Không tìm thấy khung giờ");
            prioritySchedule.setTimeSlot(timeSlot);
        } else {
            throw new Error("Khung giờ không được là rỗng");
        }

        return priorityScheduleRepository.save(prioritySchedule);
    }

    @Transactional
    public void deletePriorityScheduleById(int id) {
        PrioritySchedule prioritySchedule = priorityScheduleRepository.findById(id).orElse(null);
        if (prioritySchedule == null)
            throw new Error("Không tìm thấy lịch ưu tiên");
        priorityScheduleRepository.deleteById(id);
    }
}
