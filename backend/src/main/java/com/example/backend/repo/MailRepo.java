package com.example.backend.repo;

import com.example.backend.entities.Mail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MailRepo extends JpaRepository<Mail,Long> {

}
