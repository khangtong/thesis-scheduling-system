package com.example.back_end.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"DOT_BV\"")
public class DefensePeriod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"DBV_ID\"")
    private Integer id;

    @Column(name = "\"DBV_Ten\"")
    private String name;

    @Column(name = "\"DBV_NgayBD\"")
    private LocalDateTime start;

    @Column(name = "\"DBV_NgayKT\"")
    private LocalDateTime end;

    @Column(name = "\"DBV_HoatDong\"")
    private boolean active;

    public DefensePeriod() {}

    public DefensePeriod(Integer id, String name, LocalDateTime start, LocalDateTime end, boolean active) {
        this.id = id;
        this.name = name;
        this.start = start;
        this.end = end;
        this.active = active;
    }

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

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "DefensePeriod{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", start=" + start +
                ", end=" + end +
                ", active=" + active +
                '}';
    }
}
