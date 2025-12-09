package com.example.backend.services.mailService;//package com.example.backend.services;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.*;
import com.example.backend.factories.MailFactory;
import com.example.backend.repo.FolderRepo;
import com.example.backend.repo.MailRepo;
import com.example.backend.repo.MailSnapshotRepo;
import com.example.backend.repo.UserRepo;
import com.example.backend.services.AttachmentService;
import com.example.backend.services.FolderService;
import com.example.backend.services.filter.AndCriteria;
import com.example.backend.services.filter.MailCriteria;
import com.example.backend.services.filter.SenderCriteria;
import com.example.backend.services.filter.SubjectCriteria;
import com.example.backend.services.mailService.strategy.MailSorter;
import com.example.backend.services.mailService.strategy.MailSortingStrategy;
import com.example.backend.services.mailService.strategy.SortByDate;
import com.example.backend.services.mailService.strategy.SortByPriority;
import jakarta.transaction.Transactional;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MailService {
    @Autowired
    private MailSnapshotRepo mailSnapshotrepo;

    @Autowired
    private MailRepo mailRepo;

    @Autowired
    private FolderService folderService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FolderRepo folderRepo ;

    @Autowired
    private AttachmentService attachmentService;
    public List<String> createNewMail(MailDto dto) {

        User senderUser = userRepo.findByEmail(dto.getSender());
        if (senderUser == null) throw new RuntimeException("Sender not found");

        String senderId = senderUser.getUserId();

        // sender copy
        Mail senderCopy = MailFactory.createSenderCopy(senderId, dto);
        senderCopy = mailRepo.save(senderCopy);
        folderService.addMail(senderUser.getSentFolderId(), senderCopy);

        Queue<String> receiversQueue = new LinkedList<>(dto.getReceivers());

        List<String> ids = new ArrayList<>();
        ids.add(senderCopy.getMailId());

        while (!receiversQueue.isEmpty()) {

            String currentReceiverEmail = receiversQueue.poll();

            User receiverUser = userRepo.findByEmail(currentReceiverEmail);
            if (receiverUser == null) continue;

            String receiverId = receiverUser.getUserId();

            // receiver copy
            Mail receiverCopy = MailFactory.createReceiverCopy(receiverId, dto, currentReceiverEmail);
            receiverCopy = mailRepo.save(receiverCopy);

            attachmentService.duplicateAttachmentsForNewMail(
                    senderCopy.getMailId(),
                    receiverCopy
            );

            folderService.addMail(receiverUser.getInboxFolderId(), receiverCopy);

            ids.add(receiverCopy.getMailId());
        }

        return ids;
    }

    @Transactional
    public void deleteMailById(String mailId , String folderId) {

        Folder folder = folderRepo.findByFolderId(folderId) ;
        Mail mail = mailRepo.findById(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));

        folderService.deleteMail( folderId , mail);


        Mail helpingMail = mailRepo.findByMailId(mailId);

        User user = userRepo.findByUserId(helpingMail.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder trash = folderRepo.findByFolderId(user.getTrashFolderId()) ;

        if (!mail.getFolders().contains(trash)) {
            trash.addMail(mail);

            /* long thirtyOneDaysAgo = System.currentTimeMillis() - (31L * 24 * 60 * 60 * 1000); // for testing
            mail.setDeletedAt(new Timestamp(thirtyOneDaysAgo)); for testing */

            mail.setDeletedAt(new Timestamp(System.currentTimeMillis()));


            folderRepo.save(trash);
            mailRepo.save(mail);
        }
    }

    public List<Mail> filterEmails(String folderId, String subject, String sender) {

        List<Mail> emails = mailRepo.getMailsByFolderId(folderId);

        MailCriteria criteria = null;

        if (subject != null) {
            criteria = (criteria == null)
                    ? new SubjectCriteria(subject)
                    : new AndCriteria(criteria, new SubjectCriteria(subject));
        }

        if (sender != null) {
            criteria = (criteria == null)
                    ? new SenderCriteria(sender)
                    : new AndCriteria(criteria, new SenderCriteria(sender));
        }

        if (criteria == null)
            return emails;

        return criteria.meetCriteria(emails);
    }

    public List<Mail> searchEmails(String folderId, String keyword) {
        return mailRepo.getMailsByFolderId(folderId).stream()
                .filter(mail -> mail.getSubject().contains(keyword)
                        || mail.getBody().contains(keyword)
                        || mail.getSenderEmail().contains(keyword)
                        || mail.getReceiverEmails().contains(keyword))
                .collect(Collectors.toList());
    }


    @Transactional
    public void moveMails(String fromFolderId, String toFolderId, List<String> ids) {
        Queue<String> queue = new LinkedList<>(ids);
        while (!queue.isEmpty()) {
            String mailId = queue.poll();
            Mail mail = mailRepo.findById(mailId)
                    .orElseThrow(() -> new RuntimeException("Mail not found"));
            folderService.addMail(toFolderId, mail);
            folderService.deleteMail(fromFolderId,mail);

        }
    }

    public List<Mail> sortMails(String folderId, String sortType) {

        List<Mail> mails = mailRepo.getMailsByFolderId(folderId);
        System.out.println(mails);

        MailSortingStrategy strategy;

        switch (sortType.toLowerCase()) {
            case "priority" -> strategy = new SortByPriority();
            //might implement later
//            case "subject" -> strategy = new SortBySubject();
//            case "sender" -> strategy = new SortBySender();
            default -> strategy = new SortByDate();
        }

        MailSorter sorter = new MailSorter(strategy);
        return sorter.sort(mails);
    }





    public Mail saveDraft(MailDto dto) {

        User user = userRepo.findByEmail(dto.getSender()) ;


        Mail draft = Mail.builder()
                .userId(user.getUserId())
                .senderEmail(dto.getSender())
                .receiverEmails(dto.getReceivers() != null ? new ArrayList<>(dto.getReceivers()) : new ArrayList<>())
                .subject(dto.getSubject())
                .body(dto.getBody())
                .priority(dto.getPriority())
                .status(MailStatus.DRAFT)
                .date(Timestamp.valueOf(LocalDateTime.now()))
                .isRead(true)
                .build();

        draft = mailRepo.save(draft);
        folderService.addMail(user.getDraftsFolderId(), draft);
        saveSnapshot(draft);
        return draft;
    }

    public List<Mail> getDrafts(String userId) {
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Folder draftFolder = folderRepo.findByFolderId(user.getDraftsFolderId()) ;
        return mailRepo.getMailsByFolderId(draftFolder.getFolderId());
    }

    public Mail updateDraft(String mailId, MailDto dto) {
        Mail draft = mailRepo.findByMailId(mailId);
        if (draft == null || draft.getStatus() != MailStatus.DRAFT) {
            throw new RuntimeException("Draft not found");
        }

        draft.setSubject(dto.getSubject());
        draft.setBody(dto.getBody());
        draft.setPriority(dto.getPriority());
        draft.setReceiverEmails(dto.getReceivers() != null ? dto.getReceivers() : new ArrayList<>());
        draft.setDate(Timestamp.valueOf(LocalDateTime.now()));

        draft = mailRepo.save(draft);

        saveSnapshot(draft); // auto-saving snapshot
        return draft;
    }

    private void saveSnapshot(Mail draft) {
        MailSnapshot snapshot = MailSnapshot.builder()
                .mail(draft)
                .subject(draft.getSubject())
                .body(draft.getBody())
                .receiverEmails(new ArrayList<>(draft.getReceiverEmails()))
                .savedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();
        mailSnapshotrepo.save(snapshot);
    }

    public List<MailSnapshot> getSnapshots(String mailId) {
        Mail mail = mailRepo.findByMailId(mailId);
        if (mail == null) return new ArrayList<>();
        return mailSnapshotrepo.findByMail(mail);
    }


    public void sendDraft(String mailId) {
        Mail draft = mailRepo.findByMailId(mailId);
        if (draft == null || draft.getStatus() != MailStatus.DRAFT) {
            throw new RuntimeException("Draft not found");
        }

        draft.setStatus(MailStatus.SENT);
        draft.setDate(Timestamp.valueOf(LocalDateTime.now()));
        mailRepo.save(draft);


        for (String receiverEmail : draft.getReceiverEmails()) {
            User receiver = userRepo.findByEmail(receiverEmail);
            if (receiver == null) continue;
            Mail receiverCopy = Mail.builder()
                    .userId(receiver.getUserId())
                    .senderEmail(draft.getSenderEmail())
                    .receiverEmails(List.of(receiverEmail))
                    .subject(draft.getSubject())
                    .body(draft.getBody())
                    .priority(draft.getPriority())
                    .status(MailStatus.SENT)
                    .date(Timestamp.valueOf(LocalDateTime.now()))
                    .isRead(false)
                    .build();
            mailRepo.save(receiverCopy);
            folderService.addMail(receiver.getInboxFolderId(), receiverCopy);
        }


        User sender = userRepo.findByUserId(draft.getUserId()).orElseThrow();
        folderService.deleteMail(sender.getDraftsFolderId(), draft);
        folderService.addMail(sender.getSentFolderId(), draft);
        mailRepo.delete(draft);
    }
}
