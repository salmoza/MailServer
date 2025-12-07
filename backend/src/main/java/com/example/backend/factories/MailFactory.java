package com.example.backend.factories;

import com.example.backend.dtos.AttachmentDto;
import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Attachment;
import com.example.backend.entities.Mail;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MailFactory {



    public static List<Mail> createPair(MailDto dto, String currentReceiverEmail) {

        Mail senderCopy = new Mail();
        Mail receiverCopy = new Mail();

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());
        senderCopy.setDate(now);
        receiverCopy.setDate(now);


        senderCopy.setSenderEmail(dto.getSender());
        senderCopy.setReceiverEmail(currentReceiverEmail);
        senderCopy.setSubject(dto.getSubject());
        senderCopy.setBody(dto.getBody());
        senderCopy.setPriority(dto.getPriority());
        senderCopy.setIsRead(true);


        receiverCopy.setSenderEmail(dto.getSender());
        receiverCopy.setReceiverEmail(currentReceiverEmail);
        receiverCopy.setSubject(dto.getSubject());
        receiverCopy.setBody(dto.getBody());
        receiverCopy.setPriority(2);
        receiverCopy.setIsRead(false);

        return List.of(senderCopy, receiverCopy);
    }
}
