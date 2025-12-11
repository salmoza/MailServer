package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class MailListDto {
    private String mailId;
    private String senderEmail;
    private String senderDisplayName;
    private List<String> receiver;
    private List<AttachmentDto> attachments;
    private String body;
    private String subject;
    private LocalDateTime date;
    private Boolean isRead;
}
