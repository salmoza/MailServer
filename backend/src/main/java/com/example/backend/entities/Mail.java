package com.example.backend.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

import java.util.*;

@Entity
@Getter
@Setter
public class Mail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String mailId;
    private String userId;
    private String receiverEmail;
    private String senderEmail;
    private int priority;
    private String subject;
    private String body;
    private Timestamp deletedAt;
    @OneToMany(mappedBy = "mail", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<Attachment> attachments;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    public Timestamp date;

    @ManyToMany(mappedBy = "mails")
    @JsonIgnore
    private Set<Folder> folders = new HashSet<>() ;

     // public String state;

    public Boolean isRead;

    public Mail() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Mail mail = (Mail) o;
        return Objects.equals(mailId, mail.mailId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(mailId);
    }
}
