package com.example.backend.dtos;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MailListDto {
    private String mailId;
    private String senderEmail;
    private String senderDisplayName;
    private List<String> receiverEmails;
    private List<String> receiverDisplayNames;
    private String subject;
    private LocalDateTime date;
    private Boolean isRead;
    private int priority;
}