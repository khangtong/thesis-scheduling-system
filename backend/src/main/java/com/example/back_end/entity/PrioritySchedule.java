package com.example.back_end.entity;

import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;

@Entity
@Table(name = "\"LICH_UU_TIEN\"")
public class PrioritySchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"LUT_ID\"")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "\"LUT_GiangVien\"")
    private Lecturer lecturer;

    @ManyToOne
    @JoinColumn(name = "\"LUT_KhungGio\"")
    private TimeSlot timeSlot;

    public PrioritySchedule() {}

    @Autowired
    public PrioritySchedule(Integer id, Lecturer lecturer, TimeSlot timeSlot) {
        this.id = id;
        this.lecturer = lecturer;
        this.timeSlot = timeSlot;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Lecturer getLecturer() {
        return lecturer;
    }

    public void setLecturer(Lecturer lecturer) {
        this.lecturer = lecturer;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(TimeSlot timeSlot) {
        this.timeSlot = timeSlot;
    }

    @Override
    public String toString() {
        return "PrioritySchedule{" +
                "id=" + id +
                ", lecturer=" + lecturer +
                ", timeSlot=" + timeSlot +
                '}';
    }
}
