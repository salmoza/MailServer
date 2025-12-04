package com.example.backend.dtos;

import com.example.backend.entities.Attachment;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
public class MailDto {
    public Long id;
    public String userId;
    public String folderId;
    private String receiver;
    private String sender;
    private String subject;
    private String body;
    private int priority;
    private List<AttatchmentDto> attachments;
    public Timestamp date;
    public String state;
    public Boolean isStarred;
    public Boolean isRead;
}
