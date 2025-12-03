package com.example.backend.entities;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class Mail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne User recipient;
    private String receiverEmail;
    private String senderEmail;
    private int priority;
    private String subject;
    private String body;
    @OneToMany(mappedBy = "mailId",cascade = CascadeType.ALL)
    private List<Attachment> attachments;
    private Date dateofsend;
    private String folderName;
    /*the folder name is were the mail is (trash,Inbox,...)*/

    public Mail() {
    }
}
