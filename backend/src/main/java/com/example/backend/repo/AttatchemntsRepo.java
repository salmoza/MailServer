package com.example.backend.repo;

import com.example.backend.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttatchemntsRepo extends JpaRepository<Attachment,Long> {
    List<Attachment> findByMailId(Long mailId);
}
