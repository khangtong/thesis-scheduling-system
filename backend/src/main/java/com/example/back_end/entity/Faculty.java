package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"KHOA\"")
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"K_ID\"")
    private Integer id;

    @Column(name = "\"K_Ten\"")
    private String name;

    public Faculty() {}

    public Faculty(Integer id, String name) {
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

    @Override
    public String toString() {
        return "Faculty{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
