package com.example.backend.model;

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
//    private String displayName;
    private String username;
    @Column(unique = true, nullable = false)
    private String email;
    @JsonIgnore
    private String password;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Folder> folders;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
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

    public String getTrashFolderId(){
        if (folders == null ) return  null ;

        for (Folder folder : folders ) {
            if (folder.getFolderName().equals("Trash")){
                return folder.getFolderId();
            }
        } return null ;
    }

    public String getDraftsFolderId(){
        if (folders == null ) return  null ;

        for (Folder folder : folders ) {
            if (folder.getFolderName().equals("Drafts")){
                return folder.getFolderId();
            }
        } return null ;
    }

}
