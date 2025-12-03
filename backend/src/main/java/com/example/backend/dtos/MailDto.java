package com.example.backend.dtos;

import com.example.backend.entities.Attachment;
import com.example.backend.entities.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class MailDto {
    private String receiverEmail;
    private String senderEmail;
    private int priority;
    private String subject;
    private String body;
    private List<Attachment> attachments;
    private Date dateofsend;
    private String folderName;
}
