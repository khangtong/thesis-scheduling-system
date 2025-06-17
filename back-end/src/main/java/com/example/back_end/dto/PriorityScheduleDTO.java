package com.example.back_end.dto;

import org.springframework.beans.factory.annotation.Autowired;

public class PriorityScheduleDTO {
    private Integer id;
    private Integer lecturerId;
    private Integer timeSlotId;

    public PriorityScheduleDTO() {}

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

    public Integer getTimeSlotId() {
        return timeSlotId;
    }

    public void setTimeSlotId(Integer timeSlotId) {
        this.timeSlotId = timeSlotId;
    }
}
