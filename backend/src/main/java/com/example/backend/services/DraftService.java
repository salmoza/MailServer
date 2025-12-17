package com.example.backend.services;

import com.example.backend.dtos.MailDto;
import com.example.backend.model.*;
import com.example.backend.mappers.MailFactory;
import com.example.backend.repo.FolderRepo;
import com.example.backend.repo.MailRepo;
import com.example.backend.repo.MailSnapshotRepo;
import com.example.backend.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DraftService {
    @Autowired
    private MailSnapshotRepo mailSnapshotrepo ;

    @Autowired
    private MailRepo mailRepo;

    @Autowired
    private FolderService folderService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FolderRepo folderRepo ;

    @Autowired
    private MailSnapshotRepo mailSnapshotRepo ;


    public Mail saveDraft(MailDto dto) {

        User user = userRepo.findByEmail(dto.getSender()) ;
        dto.setUserId(user.getUserId());

        Mail draft = MailFactory.createDraftCopy(dto) ;

        draft = mailRepo.save(draft);
        folderService.addMail(null ,user.getDraftsFolderId(), draft);
        saveSnapshot(draft);
        return draft;
    }

    public List<Mail> getDrafts(String userId) {
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Folder draftFolder = folderRepo.findByFolderId(user.getDraftsFolderId())
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        return mailRepo.getMailsByFolderId(draftFolder.getFolderId());
    }

    public Mail updateDraft(String mailId, MailDto dto) {
        Mail draft = mailRepo.findByMailId(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));
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
        MailSnapshot snapshot = MailFactory.createSnapshot(draft) ;
        mailSnapshotrepo.save(snapshot);
    }

    public List<MailSnapshot> getSnapshots(String mailId) {
        Mail mail = mailRepo.findByMailId(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));
        if (mail == null) return new ArrayList<>();
        return mailSnapshotrepo.findByMail(mail);
    }


    @Transactional
    public void sendDraft(String mailId) {
        Mail draft = mailRepo.findByMailId(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));

        if (draft == null || draft.getStatus() != MailStatus.DRAFT) {
            throw new RuntimeException("Draft not found");
        }


        User senderUser = userRepo.findByUserId(draft.getUserId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        mailSnapshotRepo.deleteByMailId(draft.getMailId());


        List<String> receiverDisplayNames = new ArrayList<>();


        for (String receiverEmail : draft.getReceiverEmails()) {
            User receiverUser = userRepo.findByEmail(receiverEmail);


            if (receiverUser == null) {
                receiverDisplayNames.add(receiverEmail);
                continue;
            }

            Contact senderContact = senderUser.getContacts().stream()
                    .filter(c -> c.getEmailAddresses().contains(receiverUser.getEmail()))
                    .findFirst()
                    .orElse(null);

            if (senderContact != null) {
                receiverDisplayNames.add(senderContact.getName());
            } else if (receiverUser.getUsername() != null) {
                receiverDisplayNames.add(receiverUser.getUsername());
            } else {
                receiverDisplayNames.add(receiverUser.getEmail());
            }
        }


        draft.setStatus(MailStatus.SENT);
        draft.setDate(Timestamp.valueOf(LocalDateTime.now()));


        draft.setSenderDisplayName(
                senderUser.getUsername() != null
                        ? senderUser.getUsername()
                        : senderUser.getEmail()
        );

        draft.setReceiverDisplayNames(receiverDisplayNames);

        mailRepo.save(draft);


        for (String receiverEmail : draft.getReceiverEmails()) {
            User receiver = userRepo.findByEmail(receiverEmail);
            if (receiver == null) continue;

            Mail receiverCopy = MailFactory.createReceiverCopyFromDraft(receiver.getUserId(), draft, receiverEmail);


            Contact receiverContact = receiver.getContacts().stream()
                    .filter(c -> c.getEmailAddresses().contains(senderUser.getEmail()))
                    .findFirst()
                    .orElse(null);

            if (receiverContact != null) {
                receiverCopy.setSenderDisplayName(receiverContact.getName());
            } else if (senderUser.getUsername() != null) {
                receiverCopy.setSenderDisplayName(senderUser.getUsername());
            } else {
                receiverCopy.setSenderDisplayName(senderUser.getEmail());
            }


            receiverCopy.setReceiverDisplayNames(receiverDisplayNames);



            if (draft.getAttachments() != null && !draft.getAttachments().isEmpty()) {
                List<Attachment> receiverAttachments = new ArrayList<>();
                for (Attachment senderAtt : draft.getAttachments()) {
                    Attachment newAtt = new Attachment();
                    newAtt.setFilename(senderAtt.getFilename());
                    newAtt.setFiletype(senderAtt.getFiletype());
                    newAtt.setFilesize(senderAtt.getFilesize());
                    newAtt.setFilePath(senderAtt.getFilePath());
                    newAtt.setMail(receiverCopy);
                    receiverAttachments.add(newAtt);
                }
                receiverCopy.setAttachments(receiverAttachments);
            }

            mailRepo.save(receiverCopy);
            folderService.addMail(null, receiver.getInboxFolderId(), receiverCopy);
            // applyFilters(receiverCopy, receiver.getUserId());
        }


        folderService.deleteMail(senderUser.getDraftsFolderId(), draft);
        folderService.addMail(null, senderUser.getSentFolderId(), draft);
    }

    @Transactional
    public void deleteForever(List<String> ids) {
        Mail mail = mailRepo.findByMailId(ids.get(0))
                .orElseThrow(() -> new RuntimeException("Mail not found"));
        Folder folder = mail.getFolders().get(0);

        for (String i : ids) {

            mailSnapshotRepo.deleteByMailId(i);

            Mail deletedMail = mailRepo.findByMailId(i)
                    .orElseThrow(() -> new RuntimeException("Mail not found"));
            folder.deleteMail(deletedMail);
            mailRepo.delete(deletedMail);
        }
        folderRepo.save(folder) ;
    }

    @Transactional
    public void force(String draftId, String snapshotId) {

        Mail draft = mailRepo.findByMailId(draftId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));

        MailSnapshot snapshot = mailSnapshotRepo.findBySnapshotId(snapshotId)
                .orElseThrow(() -> new RuntimeException("Snapshot not found"));


        draft.setSubject(snapshot.getSubject());
        draft.setBody(snapshot.getBody());
        draft.setPriority(snapshot.getPriority());
        draft.setReceiverEmails(snapshot.getReceiverEmails() != null ? new ArrayList<>(snapshot.getReceiverEmails()) : new ArrayList<>());
        draft.setDate(Timestamp.valueOf(LocalDateTime.now()));


        List<Attachment> currentAttachments = draft.getAttachments();
        if(currentAttachments != null) {

            for(Attachment att : currentAttachments) {
                att.setMail(null);
            }
            currentAttachments.clear();
        }


        List<Attachment> snapshotAttachments = snapshot.getAttachments();
        if (snapshotAttachments != null && !snapshotAttachments.isEmpty()) {
            List<Attachment> restoredAttachments = new ArrayList<>();
            for (Attachment att : snapshotAttachments) {

                att.setMail(draft);
                restoredAttachments.add(att);
            }
            draft.setAttachments(restoredAttachments);
        }

        mailRepo.save(draft);
    }
}
