package com.example.backend.services;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.*;
import com.example.backend.factories.MailFactory;
import com.example.backend.repo.FolderRepo;
import com.example.backend.repo.MailRepo;
import com.example.backend.repo.MailSnapshotRepo;
import com.example.backend.repo.UserRepo;
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


    public Mail saveDraft(MailDto dto) {

        User user = userRepo.findByEmail(dto.getSender()) ;
        dto.setUserId(user.getUserId());

        Mail draft = MailFactory.createDraftCopy(dto) ;

        draft = mailRepo.save(draft);
        folderService.addMail(user.getDraftsFolderId(), draft);
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

        draft.setSubject(dto.getSubject()); // builder could make some troubles
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


    public void sendDraft(String mailId) {
        Mail draft = mailRepo.findByMailId(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));
        if (draft == null || draft.getStatus() != MailStatus.DRAFT) {
            throw new RuntimeException("Draft not found");
        }

        draft.setStatus(MailStatus.SENT);
        draft.setDate(Timestamp.valueOf(LocalDateTime.now()));
        mailRepo.save(draft);


        for (String receiverEmail : draft.getReceiverEmails()) {
            User receiver = userRepo.findByEmail(receiverEmail);
            if (receiver == null) continue;
            Mail receiverCopy = MailFactory.createReceiverCopyFromDraft(receiver.getUserId() , draft , receiverEmail) ;
            mailRepo.save(receiverCopy);
            folderService.addMail(receiver.getInboxFolderId(), receiverCopy);
        }


        User sender = userRepo.findByUserId(draft.getUserId()).orElseThrow();
        folderService.deleteMail(sender.getDraftsFolderId(), draft);
        folderService.addMail(sender.getSentFolderId(), draft);
        mailRepo.delete(draft);
    }

}
