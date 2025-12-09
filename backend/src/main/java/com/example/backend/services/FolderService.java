package com.example.backend.services;

import com.example.backend.entities.Folder;
import com.example.backend.entities.Mail;
import com.example.backend.entities.User;
import com.example.backend.repo.FolderRepo;
import com.example.backend.repo.MailRepo;
import com.example.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FolderService {
    @Autowired
    private FolderRepo folderRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private MailRepo mailRepo;
    public Folder createFolder(String userId, String folderName){
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
//        System.out.println(user.getUserId());
        Folder folder = new Folder(folderName, user);
        userRepo.save(user);
        return folderRepo.save(folder);
    }
    public void deleteFolder(String userId, String folderId){
        folderRepo.delete(folderRepo.findByFolderIdAndUserUserId(folderId, userId));
    }

    public void addMail( String folderId, Mail mail){
        Folder folder = folderRepo.findByFolderId(folderId);

        folder.addMail(mail);
        folderRepo.save(folder);

    }

    public void deleteMail( String folderId, Mail mail){
        Folder folder = folderRepo.findByFolderId(folderId);
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



}
