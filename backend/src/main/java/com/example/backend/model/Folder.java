package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Objects;
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
    private Set<Mail> mails = new HashSet<>(); // to prepare the set

    public Folder(String folderName, User user) {
        this.folderName = folderName;
        this.user = user;
    }

    public void addMail(Mail mail) {

        mails.add(mail);
        mail.getFolders().add(this);
    }
    public void deleteMail(Mail mail) {
        mails.remove(mail);
        mail.getFolders().remove(this);
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Folder folder = (Folder) o;
        return Objects.equals(folderId, folder.folderId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(folderId);
    }


}
