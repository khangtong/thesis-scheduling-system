package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"VAI_TRO_HOI_DONG\"")
public class CommitteeRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"VTHD_ID\"")
    private Integer id;

    @Column(name = "\"VTHD_Ten\"")
    private String name;

    public CommitteeRole() {}

    public CommitteeRole(Integer id, String name) {
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
        return "CommitteeRole{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
