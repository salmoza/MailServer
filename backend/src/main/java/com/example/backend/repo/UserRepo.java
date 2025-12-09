package com.example.backend.repo;

import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User,String> {
    User findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByUserId(String userId);

//    Optional<User> findByUser(User user);
}
