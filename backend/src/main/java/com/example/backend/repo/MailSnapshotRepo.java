package com.example.backend.repo;

import com.example.backend.model.Mail;
import com.example.backend.model.MailSnapshot;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MailSnapshotRepo extends JpaRepository<MailSnapshot, String> {
    List<MailSnapshot> findByMail(Mail mail);
    @Modifying
    @Transactional
    @Query("DELETE FROM MailSnapshot ms WHERE ms.mail.mailId = :mailId")
    void deleteByMailId(String mailId);
    Optional<MailSnapshot> findBySnapshotId(String snapshotId) ;
}