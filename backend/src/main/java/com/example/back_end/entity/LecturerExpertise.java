package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"GV_CM\"")
public class LecturerExpertise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"GVCM_ID\"")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "\"GVCM_GiangVien\"")
    private Lecturer lecturer;

    @ManyToOne
    @JoinColumn(name = "\"GVCM_ChuyenMon\"")
    private Expertise expertise;

    public LecturerExpertise() {}

    public LecturerExpertise(Integer id, Lecturer lecturer, Expertise expertise) {
        this.id = id;
        this.lecturer = lecturer;
        this.expertise = expertise;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Lecturer getLecturer() {
        return lecturer;
    }

    public void setLecturer(Lecturer lecturer) {
        this.lecturer = lecturer;
    }

    public Expertise getExpertise() {
        return expertise;
    }

    public void setExpertise(Expertise expertise) {
        this.expertise = expertise;
    }

    @Override
    public String toString() {
        return "Lecturer_Expertise{" +
                "id=" + id +
                ", lecturer=" + lecturer +
                ", expertise=" + expertise +
                '}';
    }
}
