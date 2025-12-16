package com.example.backend.services;

import com.example.backend.model.Folder;
import com.example.backend.model.Mail;
import com.example.backend.model.User;
import com.example.backend.repo.FolderRepo;
import com.example.backend.repo.MailRepo;
import com.example.backend.repo.UserRepo;
import com.example.backend.services.mailService.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FolderService {
    @Autowired
    private FolderRepo folderRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private MailService mailService;

    @Autowired
    private MailRepo mailRepo;
    public Folder createFolder(String userId, String folderName){
        System.out.println("in createFolder");
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
//        System.out.println(user.getUserId());
        Folder folder = new Folder(folderName, user);
        userRepo.save(user);
        return folderRepo.save(folder);
    }
    public void deleteFolder(String userId, String folderId){
        Folder folder = folderRepo.findByFolderIdAndUserUserId(folderId, userId);

        User folderOwner = folder.getUser();
        Set<Mail> mails = new HashSet<>(folder.getMails());

        System.out.println("in deleteFolder");

        // Get user's Sent and Inbox folder IDs (assuming they exist)
        List<Folder> userFolders = folderRepo.findByUserUserId(userId);
        String sentFolderId = userFolders.stream()
                .filter(f -> "Sent".equals(f.getFolderName()))
                .map(Folder::getFolderId)
                .findFirst()
                .orElse(null);

        System.out.println(sentFolderId);

        String inboxFolderId = userFolders.stream()
                .filter(f -> "Inbox".equals(f.getFolderName()))
                .map(Folder::getFolderId)
                .findFirst()
                .orElse(null);

        System.out.println(inboxFolderId);

        // Move each email based on sender check
        for (Mail mail : mails) {
            List<String> mailId = new ArrayList<>();
            mailId.add(mail.getMailId());
            if (folderOwner.getEmail().equals(mail.getSenderEmail())) {
                // User is the sender, move to Sent folder
                mailService.moveMails(folderId, sentFolderId, mailId);
            } else {
                // User is not the sender, move to Inbox folder
                mailService.moveMails(folderId, inboxFolderId, mailId);
            }
        }

        // Delete the folder
        folderRepo.delete(folder);
    }

    public void addMail(String previousState , String folderId, Mail mail){
        Folder folder = folderRepo.findByFolderId(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        mail.setPreviousFolderId(previousState);
        folder.addMail(mail);
        folderRepo.save(folder);

    }

    public void deleteMail( String folderId, Mail mail){
        Folder folder = folderRepo.findByFolderId(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        folder.deleteMail(mail);
        folderRepo.save(folder) ;
    }

    public List<Folder> getFolders(String userId) {
        System.out.println(folderRepo.findByUserUserId(userId));
        return folderRepo.findByUserUserId(userId);
    }

    public Map<String,String> initialize(String userId) {
        Map<String,String> folderIds = new HashMap<>();
        Folder inbox = createFolder(userId, "Inbox");
        Folder Draft = createFolder(userId, "Drafts");
        Folder Sent = createFolder(userId, "Sent");
        Folder Trash = createFolder(userId, "Trash");
        folderIds.put("inboxId",inbox.getFolderId());
        folderIds.put("DraftId",Draft.getFolderId());
        folderIds.put("SentId",Sent.getFolderId());
        folderIds.put("TrashId",Trash.getFolderId());
        return folderIds;
    }

    public Folder renameFolder(String folderId, String newName) {
        // Find the folder by ID
        Folder folder = folderRepo.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        // Update the folder name
        folder.setFolderName(newName);

        // Save the updated folder
        return folderRepo.save(folder);
    }

    public List<Folder> getCustomFolders(String userId) {
        // The folders to exclude
        List<String> defaultFolders = List.of("Inbox", "Sent", "Drafts", "Trash");

        // Fetch from repo
        return folderRepo.findCustomFolders(userId, defaultFolders);
    }



}
