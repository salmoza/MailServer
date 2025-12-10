package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
public class MailDto {

    private String userId ;
    private String folderId;
    private List<String> receivers;
    private String sender;
    private String senderDisplayName;
    private String subject;
    private String body;
    private int priority;
    private List<AttachmentDto> attachments;
    public LocalDateTime date;

}
