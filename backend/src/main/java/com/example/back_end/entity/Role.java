package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"VAI_TRO\"")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"VT_ID\"")
    private Integer id;

    @Column(name = "\"VT_Ten\"")
    private String name;

    public Role() {};

    public Role(Integer id, String name) {
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
        return "Role{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
