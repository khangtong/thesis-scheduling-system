package com.example.back_end.entity;

import jakarta.persistence.*;
import org.springframework.data.repository.cdi.Eager;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"LUAN_VAN\"")
public class Thesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"LV_ID\"")
    private Integer id;

    @Column(name = "\"LV_TenDeTai\"")
    private String title;

    @Column(name = "\"LV_TrangThai\"")
    private String status;

    @Column(name = "\"LV_Tao\"")
    private LocalDateTime createdAt;

    @Column(name = "\"LV_CapNhat\"")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "\"LV_SinhVien\"")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "\"LV_GiangVien\"")
    private Lecturer lecturer;

    @ManyToOne
    @JoinColumn(name = "\"LV_HoiDong\"")
    private DefenseCommittee defenseCommittee;

    public Thesis() {}

    public Thesis(Integer id, String title, String status, LocalDateTime createdAt, LocalDateTime updatedAt, Student student, Lecturer lecturer, DefenseCommittee defenseCommittee) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.student = student;
        this.lecturer = lecturer;
        this.defenseCommittee = defenseCommittee;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Lecturer getLecturer() {
        return lecturer;
    }

    public void setLecturer(Lecturer lecturer) {
        this.lecturer = lecturer;
    }

    public DefenseCommittee getDefenseCommittee() {
        return defenseCommittee;
    }

    public void setDefenseCommittee(DefenseCommittee defenseCommittee) {
        this.defenseCommittee = defenseCommittee;
    }

    @Override
    public String toString() {
        return "Thesis{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", student=" + student +
                ", lecturer=" + lecturer +
                ", defenseCommittee=" + defenseCommittee +
                '}';
    }
}
