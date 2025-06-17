package com.example.back_end.dto;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;

public class DefenseSessionDTO {
    private Integer id;
    private String status;
    private String note;
    private Integer timeSlotId;
    private Integer roomId;
    private Integer defensePeriodId;

    public DefenseSessionDTO() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Integer getTimeSlotId() {
        return timeSlotId;
    }

    public void setTimeSlotId(Integer timeSlotId) {
        this.timeSlotId = timeSlotId;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public Integer getDefensePeriodId() {
        return defensePeriodId;
    }

    public void setDefensePeriodId(Integer defensePeriodId) {
        this.defensePeriodId = defensePeriodId;
    }
}
