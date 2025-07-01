package com.example.back_end.dto;

import java.util.List;

public class LecturerDTO {
    private Integer id;
    private String code;
    private Integer userId;
    private Integer facultyId;
    private Integer degreeId;
    private List<Integer> expertiseIds;

    public LecturerDTO() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Integer facultyId) {
        this.facultyId = facultyId;
    }

    public Integer getDegreeId() {
        return degreeId;
    }

    public void setDegreeId(Integer degreeId) {
        this.degreeId = degreeId;
    }

    public List<Integer> getExpertiseIds() {
        return expertiseIds;
    }

    public void setExpertiseIds(List<Integer> expertiseIds) {
        this.expertiseIds = expertiseIds;
    }
}
