package com.example.backend.repo;

import com.example.backend.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentsRepo extends JpaRepository<Attachment,String> {
    List<Attachment> findByAttachmentId(String mailId);
    List<Attachment> findAllByMail_MailId(String mailId);

}
