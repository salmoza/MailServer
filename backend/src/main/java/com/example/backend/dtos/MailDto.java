package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
public class MailDto {

    public String userId;
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
