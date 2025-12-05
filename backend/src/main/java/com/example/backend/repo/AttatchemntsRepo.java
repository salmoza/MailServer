package com.example.backend.repo;

import com.example.backend.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttatchemntsRepo extends JpaRepository<Attachment,String> {
    List<Attachment> findByAttachmentId(String mailId);
}
