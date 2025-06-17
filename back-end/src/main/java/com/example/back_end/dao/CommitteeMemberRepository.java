package com.example.back_end.dao;

import com.example.back_end.entity.CommitteeMember;
import com.example.back_end.entity.CommitteeRole;
import com.example.back_end.entity.DefenseCommittee;
import com.example.back_end.entity.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommitteeMemberRepository extends JpaRepository<CommitteeMember, Integer> {
    List<CommitteeMember> findByDefenseCommittee(DefenseCommittee defenseCommittee);
    List<CommitteeMember> findByLecturer(Lecturer lecturer);
    List<CommitteeMember> findByCommitteeRole(CommitteeRole committeeRole);
}
