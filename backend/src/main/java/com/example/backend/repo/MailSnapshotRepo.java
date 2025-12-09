package com.example.backend.repo;

import com.example.backend.entities.Mail;
import com.example.backend.entities.MailSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MailSnapshotRepo extends JpaRepository<MailSnapshot, String> {
    List<MailSnapshot> findByMail(Mail mail);
}