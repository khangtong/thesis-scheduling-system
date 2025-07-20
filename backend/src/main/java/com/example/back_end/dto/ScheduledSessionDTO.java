package com.example.back_end.dto;

import com.example.back_end.entity.DefenseCommittee;

import java.time.LocalDate;
import java.time.LocalTime;

public class ScheduledSessionDTO {
    private LocalTime start;
    private LocalDate date;
    private DefenseCommittee defenseCommittee;
    private String studentName;
    private String committeeRoleName;

    public ScheduledSessionDTO() {}

    public LocalTime getStart() {
        return start;
    }

    public void setStart(LocalTime start) {
        this.start = start;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public DefenseCommittee getDefenseCommittee() {
        return defenseCommittee;
    }

    public void setDefenseCommittee(DefenseCommittee defenseCommittee) {
        this.defenseCommittee = defenseCommittee;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getCommitteeRoleName() {
        return committeeRoleName;
    }

    public void setCommitteeRoleName(String committeeRoleName) {
        this.committeeRoleName = committeeRoleName;
    }
}
