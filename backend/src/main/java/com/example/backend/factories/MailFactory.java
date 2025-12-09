package com.example.backend.factories;

import com.example.backend.dtos.AttachmentDto;
import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Attachment;
import com.example.backend.entities.Mail;
import com.example.backend.repo.MailRepo;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MailFactory {

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
}

