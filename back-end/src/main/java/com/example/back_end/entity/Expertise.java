package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"CHUYEN_MON\"")
public class Expertise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"CM_ID\"")
    private Integer id;

    @Column(name = "\"CM_Ten\"")
    private String name;

    @Column(name = "\"CM_MoTa\"")
    private String description;

    public Expertise() {}

    public Expertise(Integer id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Expertise{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
