package com.example.backend.entities;

import jakarta.persistence.*;

@Entity
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String attachmentId;
    private String filetype;
    private String filePath;
    @ManyToOne
    @JoinColumn(name = "mail_id")
    private Mail mail;


    public Attachment() {
    }
}
