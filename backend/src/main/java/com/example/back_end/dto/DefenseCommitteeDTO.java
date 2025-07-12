package com.example.back_end.dto;

import java.util.List;

public class DefenseCommitteeDTO {
    private Integer id;
    private String name;
    private Integer defensePeriodId;
    private List<Integer> timeSlotIds;
    private Integer roomId;
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

    public Integer getDefensePeriodId() {
        return defensePeriodId;
    }

    public void setDefensePeriodId(Integer defensePeriodId) {
        this.defensePeriodId = defensePeriodId;
    }

    public List<Integer> getTimeSlotIds() {
        return timeSlotIds;
    }

    public void setTimeSlotIds(List<Integer> timeSlotIds) {
        this.timeSlotIds = timeSlotIds;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
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
