package com.example.back_end.dao;

import com.example.back_end.entity.CommitteeRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommitteeRoleRepository extends JpaRepository<CommitteeRole, Integer> {
}
