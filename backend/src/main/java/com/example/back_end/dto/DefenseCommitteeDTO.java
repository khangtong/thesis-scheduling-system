package com.example.back_end.dto;

import java.util.List;

public class DefenseCommitteeDTO {
    private Integer id;
    private String name;
    private List<Integer> lecturerIds;
    private List<Integer> committeeRoleIds;

    public DefenseCommitteeDTO() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Integer> getLecturerIds() {
        return lecturerIds;
    }

    public void setLecturerIds(List<Integer> lecturerIds) {
        this.lecturerIds = lecturerIds;
    }

    public List<Integer> getCommitteeRoleIds() {
        return committeeRoleIds;
    }

    public void setCommitteeRoleIds(List<Integer> committeeRoleIds) {
        this.committeeRoleIds = committeeRoleIds;
    }
}
