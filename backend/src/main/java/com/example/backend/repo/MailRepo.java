package com.example.backend.repo;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Mail;
import com.example.backend.entities.MailSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MailRepo extends JpaRepository<Mail,String> {
    public void deleteMailByMailId(@Param("mailId") String mailId);
    //for get all the mails which are related to a specific folderId
    @Query("SELECT m FROM Mail m JOIN m.folders f WHERE f.folderId = :folderId")
    List<Mail> getMailsByFolderId(@Param("folderId") String folderId);

    List<Mail> findAllByUserId(String userId);

    Optional<Mail> findByMailId (String mailId) ;
}

