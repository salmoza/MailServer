package com.example.backend.entities;

import com.example.backend.entities.Mail;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Service
public class MailSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String snapshotId;

    @ManyToOne
    @JoinColumn(name = "mail_id", nullable = false)
    @JsonIgnore
    private Mail mail;

    private String subject;
    private String body;

    @ElementCollection
    private List<String> receiverEmails = new ArrayList<>();

    private Timestamp savedAt;


}