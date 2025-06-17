package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"HOI_DONG\"")
public class DefenseCommittee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"HD_ID\"")
    private Integer id;

    @Column(name = "\"HD_Ten\"")
    private String name;

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

    @Override
    public String toString() {
        return "DefenseCommittee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
