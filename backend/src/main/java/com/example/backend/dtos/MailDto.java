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
