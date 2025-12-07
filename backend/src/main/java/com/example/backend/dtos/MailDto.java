package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class MailDto {

    private String userId ;
    private String folderId;
    private List<String> receivers;
    private String sender;
    private String senderDisplayName;   ////
    // private List<String> toEmails;   // multiple receivers
    private String subject;
    private String body;
    private int priority;
    private List<AttachmentDto> attachments;
//    public Timestamp date;
    public LocalDateTime date;
   // public String state;        // SENT, DRAFT, TRASH, etc.

    public Boolean isRead;
}
