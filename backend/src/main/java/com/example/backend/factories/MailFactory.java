package com.example.backend.factories;

import com.example.backend.dtos.AttachmentDto;
import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Attachment;
import com.example.backend.entities.Mail;

import java.security.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class MailFactory {


    public static Mail create(MailDto dto) {

        Mail mail = new Mail();

        mail.setSenderEmail(dto.getSender());
        mail.setReceiverEmail(dto.getReceiver());
        mail.setSubject(dto.getSubject());
        mail.setBody(dto.getBody());
        mail.setPriority(dto.getPriority());


        /*if (dto.getDate() != null) {
            mail.setDate(dto.getDate());  date ??
        } else {
            mail.setDate(new Timestamp(System.currentTimeMillis()));
        } */


        if (dto.getState() != null) {
            mail.setState(dto.getState());
        } else {
            mail.setState("SENT");
        }


        mail.setIsRead(dto.getIsRead() != null ? dto.getIsRead() : false);
        mail.setIsStarred(dto.getIsStarred() != null ? dto.getIsStarred() : false);

        // attachment here (the linking will be in  attachment service )

        return mail;
    }
}
