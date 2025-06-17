package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"PHONG\"")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"P_ID\"")
    private Integer id;

    @Column(name = "\"P_Ten\"")
    private String name;

    @Column(name = "\"P_HoatDong\"")
    private boolean active;

    public Room() {}

    public Room(Integer id, String name, boolean active) {
        this.id = id;
        this.name = name;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", active=" + active +
                '}';
    }
}
