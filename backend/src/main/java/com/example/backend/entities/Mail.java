package com.example.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
public class Mail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String receiverEmail;
    private String senderEmail;
    private int priority;
    private String subject;
    private String body;
    @OneToMany(mappedBy = "mail", cascade = CascadeType.ALL)
    private List<Attachment> attachments;
    public Timestamp date;

    @ManyToMany(mappedBy = "mails")
    @JsonIgnore
    private Set<Folder> folders;

    public String state;
    public Boolean isStarred;
    public Boolean isRead;

    public Mail() {
    }
}
