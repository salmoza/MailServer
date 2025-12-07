package com.example.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Table(name = "users")
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userId;
    private String displayName;
    @Column(unique = true, nullable = false)
    private String email;
    @JsonIgnore
    private String password;

    @OneToMany(mappedBy = "user")
    private List<Folder> folders;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contact> contacts;


    public User() {
    }

    public String getInboxFolderId() {
        if (folders == null) return null;

        for (Folder folder : folders) {
            if (folder.getFolderName().equals("Inbox")) {
                return folder.getFolderId();
            }
        }

        return null;
    }

    public String getSentFolderId() {
        if (folders == null) return null;

        for (Folder folder : folders) {
            if (folder.getFolderName().equals("Sent")) {
                return folder.getFolderId();
            }
        } return null ;
    }

}
