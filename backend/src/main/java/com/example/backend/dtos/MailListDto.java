package com.example.backend.dtos;

import lombok.*;

import java.time.LocalDateTime;
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
    private String receiver;
    private String subject;
    private LocalDateTime date;
    private Boolean isRead;
}
