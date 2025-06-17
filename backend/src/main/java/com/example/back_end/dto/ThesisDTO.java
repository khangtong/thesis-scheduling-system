package com.example.back_end.dto;

public class ThesisDTO {
    private Integer id;
    private String title;
    private String status;
    private Integer studentId;
    private Integer lecturerId;
    private Integer defenseCommitteeId;
    private Integer defenseSessionId;

    public ThesisDTO() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(Integer lecturerId) {
        this.lecturerId = lecturerId;
    }

    public Integer getDefenseCommitteeId() {
        return defenseCommitteeId;
    }

    public void setDefenseCommitteeId(Integer defenseCommitteeId) {
        this.defenseCommitteeId = defenseCommitteeId;
    }

    public Integer getDefenseSessionId() {
        return defenseSessionId;
    }

    public void setDefenseSessionId(Integer defenseSessionId) {
        this.defenseSessionId = defenseSessionId;
    }
}
