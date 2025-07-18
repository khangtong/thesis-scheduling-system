package com.example.back_end.service;

import com.example.back_end.dao.*;
import com.example.back_end.dto.ThesisDTO;
import com.example.back_end.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ThesisService {
    private ThesisRepository thesisRepository;
    private StudentRepository studentRepository;
    private LecturerRepository lecturerRepository;
    private TimeSlotRepository timeSlotRepository;
    private CommitteeMemberRepository committeeMemberRepository;

    @Autowired
    public ThesisService(ThesisRepository thesisRepository, StudentRepository studentRepository, LecturerRepository lecturerRepository, TimeSlotRepository timeSlotRepository, CommitteeMemberRepository committeeMemberRepository) {
        this.thesisRepository = thesisRepository;
        this.studentRepository = studentRepository;
        this.lecturerRepository = lecturerRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.committeeMemberRepository = committeeMemberRepository;
    }

    @Transactional(readOnly = true)
    public List<Thesis> getAllTheses(User user) {
        List<Thesis> theses = new ArrayList<>();

        if ("GIANG_VIEN".equals(user.getRole().getName())) {
            Lecturer lecturer = lecturerRepository.findByUser(user);
            if (lecturer == null)
                throw new Error("Không tìm thấy giảng viên");
            theses = thesisRepository.findByLecturer(lecturer);
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
        return thesisRepository.save(thesis);
    }

    @Transactional
    public void deleteThesisById(int id) {
        Thesis thesis = thesisRepository.findById(id).orElse(null);
        if (thesis == null)
            throw new Error("Không tìm thấy luận văn");
        thesisRepository.deleteById(id);
    }
}
