package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    private String userId;

    private String senderEmail;
    private int priority;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "snapshot_attachments",
            joinColumns = @JoinColumn(name = "snapshot_id"),
            inverseJoinColumns = @JoinColumn(name = "attachment_id")
    )
    private List<Attachment> attachments;


    @ManyToOne
    @JoinColumn(name = "mail_id", nullable = false)
    @JsonIgnore
    private Mail mail;

    private String subject;
    private String body;


    @ElementCollection
    private List<String> receiverEmails = new ArrayList<>();

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private Timestamp savedAt;


}