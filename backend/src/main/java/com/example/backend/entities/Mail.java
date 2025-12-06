package com.example.backend.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
public class Mail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String mailId;
    private String userId; // list of user id's ? when remove it from a folder ??
    private String receiverEmail;
    private String senderEmail;
    private int priority;
    private String subject;
    private String body;
    @OneToMany(mappedBy = "mail", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<Attachment> attachments;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    public Timestamp date;

    @ManyToMany(mappedBy = "mails")
    @JsonIgnore
    private Set<Folder> folders = new HashSet<>() ;

    public String state;
    public Boolean isStarred;
    public Boolean isRead;

    public Mail() {
    }
}
