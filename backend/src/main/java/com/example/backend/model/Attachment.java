package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String attachmentId;
    private String filetype;
    private String filePath;
    private double filesize;
    private String filename;
    @ManyToOne
    @JoinColumn(name = "mail_id")
    private Mail mail;


    public Attachment() {
    }
}
