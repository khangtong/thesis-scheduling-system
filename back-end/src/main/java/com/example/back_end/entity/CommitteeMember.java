package com.example.back_end.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"THANH_VIEN_HD\"")
public class CommitteeMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"TVHD_ID\"")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "\"TVHD_HoiDong\"")
    private DefenseCommittee defenseCommittee;

    @ManyToOne
    @JoinColumn(name = "\"TVHD_GiangVien\"")
    private Lecturer lecturer;

    @ManyToOne
    @JoinColumn(name = "\"TVHD_VaiTroHD\"")
    private CommitteeRole committeeRole;

    public CommitteeMember() {}

    public CommitteeMember(Integer id, DefenseCommittee defenseCommittee, Lecturer lecturer, CommitteeRole committeeRole) {
        this.id = id;
        this.defenseCommittee = defenseCommittee;
        this.lecturer = lecturer;
        this.committeeRole = committeeRole;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public DefenseCommittee getDefenseCommittee() {
        return defenseCommittee;
    }

    public void setDefenseCommittee(DefenseCommittee defenseCommittee) {
        this.defenseCommittee = defenseCommittee;
    }

    public Lecturer getLecturer() {
        return lecturer;
    }

    public void setLecturer(Lecturer lecturer) {
        this.lecturer = lecturer;
    }

    public CommitteeRole getCommitteeRole() {
        return committeeRole;
    }

    public void setCommitteeRole(CommitteeRole committeeRole) {
        this.committeeRole = committeeRole;
    }

    @Override
    public String toString() {
        return "CommitteeMember{" +
                "id=" + id +
                ", defenseCommittee=" + defenseCommittee +
                ", lecturer=" + lecturer +
                ", committeeRole=" + committeeRole +
                '}';
    }
}
