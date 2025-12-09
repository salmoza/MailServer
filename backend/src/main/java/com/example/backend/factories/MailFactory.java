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

    @Autowired
    MailRepo mailRepo;


    public static Mail create( String id ,MailDto dto, String currentReceiverEmail , String type) {


        Mail Copy = new Mail();

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

        Copy.setDate(now);

        Copy.setSenderEmail(dto.getSender());
        Copy.getReceiverEmails().add(currentReceiverEmail);
        Copy.setSubject(dto.getSubject());
        Copy.setBody(dto.getBody());
        if (type.equals("receiver")) {
        Copy.setPriority(2);
        Copy.setIsRead(false); }
        else if (type.equals("sender")) {
            Copy.setPriority(dto.getPriority());
            Copy.setIsRead(true);
        }
        Copy.setUserId(id);

        return  Copy ;
    }
}
