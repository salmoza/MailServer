package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MailListDto {
    private String mailId;
    private String senderEmail;
    private String senderDisplayName;
    private String receiver;
    private String subject;
    private LocalDateTime date;
    private Boolean isRead;
}
