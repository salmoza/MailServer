package com.example.backend.repo;

import com.example.backend.entities.Mail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MailRepo extends JpaRepository<Mail,String> {
    public void deleteMailByMailId(@Param("mailId") String mailId);

}
