package com.example.back_end.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "\"KHUNG_GIO\"")
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"KG_ID\"")
    private Integer id;

    @Column(name = "\"KG_Ngay\"")
    private LocalDate date;

    @Column(name = "\"KG_BatDau\"")
    private LocalTime start;

    @Column(name = "\"KG_KetThuc\"")
    private LocalTime end;

    public TimeSlot() {}

    public TimeSlot(Integer id, LocalDate date, LocalTime start, LocalTime end) {
        this.id = id;
        this.date = date;
        this.start = start;
        this.end = end;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStart() {
        return start;
    }

    public void setStart(LocalTime start) {
        this.start = start;
    }

    public LocalTime getEnd() {
        return end;
    }

    public void setEnd(LocalTime end) {
        this.end = end;
    }

    @Override
    public String toString() {
        return "TimeSlot{" +
                "id=" + id +
                ", date=" + date +
                ", start=" + start +
                ", end=" + end +
                '}';
    }
}
