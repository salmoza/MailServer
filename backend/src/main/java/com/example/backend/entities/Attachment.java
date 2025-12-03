package com.example.backend.entities;

import jakarta.persistence.*;

@Entity
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String filetype;
    private String filePath;
    private Long mailId;

    public Attachment() {
    }
}
