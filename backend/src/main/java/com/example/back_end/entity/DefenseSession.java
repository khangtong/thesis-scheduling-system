package com.example.back_end.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"BUOI_BV\"")
public class DefenseSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"BBV_ID\"")
    private Integer id;

    @Column(name = "\"BBV_TrangThai\"")
    private String status;

    @Nullable
    @Column(name = "\"BBV_GhiChu\"")
    private String note;

    @Column(name = "\"BBV_Tao\"")
    private LocalDateTime createdAt;

    @Column(name = "\"BBV_CapNhat\"")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "\"BBV_KhungGio\"")
    private TimeSlot timeSlot;

    @ManyToOne
    @JoinColumn(name = "\"BBV_Phong\"")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "\"BBV_DotBV\"")
    private DefensePeriod defensePeriod;

    public DefenseSession() {}

    public DefenseSession(Integer id, String status, String note, LocalDateTime createdAt, LocalDateTime updatedAt, TimeSlot timeSlot, Room room, DefensePeriod defensePeriod) {
        this.id = id;
        this.status = status;
        this.note = note;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.timeSlot = timeSlot;
        this.room = room;
        this.defensePeriod = defensePeriod;
    }

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

    @Nullable
    public String getNote() {
        return note;
    }

    public void setNote(@Nullable String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(TimeSlot timeSlot) {
        this.timeSlot = timeSlot;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public DefensePeriod getDefensePeriod() {
        return defensePeriod;
    }

    public void setDefensePeriod(DefensePeriod defensePeriod) {
        this.defensePeriod = defensePeriod;
    }

    @Override
    public String toString() {
        return "DefenseSession{" +
                "id=" + id +
                ", status='" + status + '\'' +
                ", note='" + note + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", timeSlot=" + timeSlot +
                ", room=" + room +
                ", defensePeriod=" + defensePeriod +
                '}';
    }
}
