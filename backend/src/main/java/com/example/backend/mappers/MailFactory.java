package com.example.backend.mappers;

import com.example.backend.dtos.AttachmentDto;
import com.example.backend.dtos.MailDto;
import com.example.backend.dtos.MailListDto;
import com.example.backend.model.*;
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
                .status(MailStatus.SENT)
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
                .status(MailStatus.SENT)
                .isRead(false)
                .date(Timestamp.valueOf(LocalDateTime.now()))
                .build();
    }

    public static Mail createDraftCopy (MailDto dto) {
        return Mail.builder()
                .userId(dto.getUserId())
                .senderEmail(dto.getSender())
                .receiverEmails(dto.getReceivers() != null ? new ArrayList<>(dto.getReceivers()) : new ArrayList<>())
                .subject(dto.getSubject())
                .body(dto.getBody())
                .priority(dto.getPriority() == 0 ? 2 : dto.getPriority())
                .status(MailStatus.DRAFT)
                .date(Timestamp.valueOf(LocalDateTime.now()))
                .isRead(true)
                .build();

    }

    public static Mail createReceiverCopyFromDraft(String receiverId,  Mail draft , String receiverEmail) {
        return Mail.builder()
                .userId(receiverId)
                .senderEmail(draft.getSenderEmail())
                .receiverEmails(List.of(receiverEmail))
                .priority(draft.getPriority())
                .subject(draft.getSubject())
                .body(draft.getBody())
                .status(MailStatus.SENT)
                .isRead(false)
                .date(Timestamp.valueOf(LocalDateTime.now()))
                .build();
    }

    public static MailSnapshot createSnapshot(Mail draft) {
        return MailSnapshot.builder()
                .userId(draft.getUserId())
                .attachments(draft.getAttachments() != null ? new ArrayList<>(draft.getAttachments()) : new ArrayList<>())
                .mail(draft)
                .subject(draft.getSubject())
                .body(draft.getBody())
                .receiverEmails(new ArrayList<>(draft.getReceiverEmails()))
                .savedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();
    }

    public MailDto toDto (Mail mail, String folderId) {

        List<AttachmentDto> attachments = new ArrayList<>();
        for (Attachment attachment : mail.getAttachments()) {
            attachments.add(attachmentFactory.toDTO(attachment));
        }
        return MailDto.builder()  // changed to be builder
                .userId(mail.getUserId())
                .folderId(folderId)
                .receivers(mail.getReceiverEmails())
                .sender(mail.getSenderEmail())
                .senderDisplayName(mail.getSenderDisplayName())
                .subject(mail.getSubject())
                .body(mail.getBody())
                .priority(mail.getPriority())
                .date(mail.getDate().toLocalDateTime())
                .attachments(attachments)
                .build() ;
    }

//    public MailComposeDto toMailComposeDto (Mail mail) {
//        if (mail.getSenderEmail().equals())
//    }



    // For inbox/folder list
    public MailListDto toListDto(Mail mail) {

        return MailListDto.builder()  // changed to builder
                .mailId(mail.getMailId())
                .senderEmail(mail.getSenderEmail())
                .senderDisplayName(mail.getSenderDisplayName())
                .receiverDisplayNames(mail.getReceiverDisplayNames())
                .subject(mail.getSubject())
                .date(mail.getDate().toLocalDateTime())
                .isRead(mail.getIsRead())
                .receiverEmails(mail.getReceiverEmails())
                .priority(mail.getPriority())
                .build() ;
    }


}

