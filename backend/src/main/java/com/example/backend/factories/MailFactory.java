package com.example.backend.factories;

import com.example.backend.dtos.MailDto;
import com.example.backend.dtos.MailListDto;
import com.example.backend.entities.Mail;
import com.example.backend.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Service
public class MailFactory {

    @Autowired
    AttachmentFactory attachmentFactory;

    public static Mail createSenderCopy(String userId, MailDto dto) {
        return Mail.builder()
                .userId(userId)
                .senderEmail(dto.getSender())
                .receiverEmails(new ArrayList<>(dto.getReceivers()))
                .priority(dto.getPriority())
                .subject(dto.getSubject())
                .body(dto.getBody())
                .isRead(true)
                .date(Timestamp.valueOf(LocalDateTime.now()))
                .build();
    }

    public static Mail createReceiverCopy(String receiverId, MailDto dto, String receiverEmail) {
        return Mail.builder()
                .userId(receiverId)
                .senderEmail(dto.getSender())
                .receiverEmails(List.of(receiverEmail))
                .priority(dto.getPriority())
                .subject(dto.getSubject())
                .body(dto.getBody())
                .isRead(false)
                .date(Timestamp.valueOf(LocalDateTime.now()))
                .build();
    }
    public MailDto toDto (Mail mail, String folderId) {
        MailDto dto = new MailDto();

        dto.setUserId(mail.getUserId());
        dto.setFolderId(folderId);
        dto.setReceivers(mail.getReceiverEmails());
        dto.setSender(mail.getSenderEmail());
        dto.setSenderDisplayName(mail.getSenderDisplayName());
        dto.setSubject(mail.getSubject());
        dto.setBody(mail.getBody());
        dto.setPriority(mail.getPriority());
        dto.setDate(mail.getDate().toLocalDateTime());

        return dto;
    }

//    public MailComposeDto toMailComposeDto (Mail mail) {
//        if (mail.getSenderEmail().equals())
//    }


    // For inbox/folder list
    public MailListDto toListDto(Mail mail) {
        MailListDto dto = new MailListDto();
        dto.setMailId(mail.getMailId());
        dto.setSenderEmail(mail.getSenderEmail());
        dto.setSenderDisplayName(mail.getSenderDisplayName());
        dto.setSubject(mail.getSubject());
        dto.setDate(mail.getDate().toLocalDateTime());
        dto.setIsRead(mail.getIsRead());
        return dto;
    }


}

