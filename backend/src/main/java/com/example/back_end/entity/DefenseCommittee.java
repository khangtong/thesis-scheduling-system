package com.example.back_end.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"HOI_DONG\"")
public class DefenseCommittee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"HD_ID\"")
    private Integer id;

    @Column(name = "\"HD_Ten\"")
    private String name;

    @Column(name = "\"HD_Tao\"")
    private LocalDateTime createdAt;

    @Column(name = "\"HD_CapNhat\"")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "\"HD_DotBV\"")
    private DefensePeriod defensePeriod;

    @ManyToOne
    @JoinColumn(name = "\"HD_Phong\"")
    private Room room;

    public DefenseCommittee() {}

    public DefenseCommittee(Integer id, String name) {
        this.id = id;
        this.name = name;
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

    public DefensePeriod getDefensePeriod() {
        return defensePeriod;
    }

    public void setDefensePeriod(DefensePeriod defensePeriod) {
        this.defensePeriod = defensePeriod;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    @Override
    public String toString() {
        return "DefenseCommittee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
