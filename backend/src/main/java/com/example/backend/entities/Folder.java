package com.example.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.PriorityQueue;
import java.util.Set;


@Entity
@Getter
@Setter
//@AllArgsConstructor
@NoArgsConstructor
@Table(name = "folders")
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String folderId;
    private String folderName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToMany
    @JoinTable(
            name = "folder_mail",
            joinColumns = @JoinColumn(name = "folder_id"),
            inverseJoinColumns = @JoinColumn(name = "mail_id")
    )
    @JsonIgnore
    private Set<Mail> mails;

    public Folder(String folderName, User user) {
        this.folderName = folderName;
        this.user = user;
    }

    public void addMail(Mail mail) {
        mails.add(mail);
    }
    public void deleteMail(Mail mail) {
        mails.remove(mail);
    }




}
