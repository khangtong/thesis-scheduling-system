package com.example.back_end.dto;

public class CommitteeMemberDTO {
    private Integer id;
    private Integer defenseCommitteeId;
    private Integer lecturerId;
    private Integer committeeRoleId;

    public CommitteeMemberDTO() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDefenseCommitteeId() {
        return defenseCommitteeId;
    }

    public void setDefenseCommitteeId(Integer defenseCommitteeId) {
        this.defenseCommitteeId = defenseCommitteeId;
    }

    public Integer getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(Integer lecturerId) {
        this.lecturerId = lecturerId;
    }

    public Integer getCommitteeRoleId() {
        return committeeRoleId;
    }

    public void setCommitteeRoleId(Integer committeeRoleId) {
        this.committeeRoleId = committeeRoleId;
    }
}
