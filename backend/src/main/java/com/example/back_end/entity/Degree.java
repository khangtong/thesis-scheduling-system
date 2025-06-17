package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"HOC_VI\"")
public class Degree {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"HV_ID\"")
    private Integer id;

    @Column(name = "\"HV_Ten\"")
    private String name;

    public Degree() {}

    public Degree(Integer id, String name) {
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
        return "Degree{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
