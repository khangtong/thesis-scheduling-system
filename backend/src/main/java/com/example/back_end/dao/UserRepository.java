package com.example.back_end.dao;

import com.example.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);

    User findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.username ILIKE %?1% OR u.email ILIKE %?1% OR u.fullname ILIKE %?1%")
    List<User> searchUsers(String query);
}
