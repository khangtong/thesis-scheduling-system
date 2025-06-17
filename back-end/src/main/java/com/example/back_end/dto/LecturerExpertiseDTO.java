package com.example.back_end.dto;

public class LecturerExpertiseDTO {
    private Integer id;
    private Integer lecturerId;
    private Integer expertiseId;

    public LecturerExpertiseDTO() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(Integer lecturerId) {
        this.lecturerId = lecturerId;
    }

    public Integer getExpertiseId() {
        return expertiseId;
    }

    public void setExpertiseId(Integer expertiseId) {
        this.expertiseId = expertiseId;
    }
}
