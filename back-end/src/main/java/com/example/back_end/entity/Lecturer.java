package com.example.back_end.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"GIANG_VIEN\"")
public class Lecturer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"GV_ID\"")
    private Integer id;

    @Column(name = "\"GV_Ma\"")
    private String code;

    @Column(name = "\"GV_Tao\"")
    private LocalDateTime createdAt;

    @Column(name = "\"GV_CapNhat\"")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "\"GV_NguoiDung\"")
    private User user;

    @ManyToOne
    @JoinColumn(name = "\"GV_Khoa\"")
    private Faculty faculty;

    @ManyToOne
    @JoinColumn(name = "\"GV_HocVi\"")
    private Degree degree;

    public Lecturer() {}

    public Lecturer(Integer id, String code, LocalDateTime createdAt, LocalDateTime updatedAt, User user, Faculty faculty, Degree degree) {
        this.id = id;
        this.code = code;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.faculty = faculty;
        this.degree = degree;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    public Degree getDegree() {
        return degree;
    }

    public void setDegree(Degree degree) {
        this.degree = degree;
    }

    @Override
    public String toString() {
        return "Lecturer{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", user=" + user +
                ", faculty=" + faculty +
                ", degree=" + degree +
                '}';
    }
}
