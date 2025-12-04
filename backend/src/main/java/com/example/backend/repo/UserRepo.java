package com.example.backend.repo;

import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {
//    Optional<User> findByEmail(String email);
//    boolean existsByEmail(String email);
    User findByUserId(Long userId);
}
