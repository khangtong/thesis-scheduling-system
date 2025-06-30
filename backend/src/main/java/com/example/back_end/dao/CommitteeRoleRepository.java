package com.example.back_end.dao;

import com.example.back_end.entity.CommitteeRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommitteeRoleRepository extends JpaRepository<CommitteeRole, Integer> {
    @Query("SELECT c FROM CommitteeRole c WHERE c.name ILIKE %?1%")
    List<CommitteeRole> searchCommitteeRoles(String query);
}
