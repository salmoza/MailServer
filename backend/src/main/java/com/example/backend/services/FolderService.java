package com.example.backend.services;

import com.example.backend.entities.Folder;
import com.example.backend.entities.Mail;
import com.example.backend.entities.User;
import com.example.backend.repo.FolderRepo;
import com.example.backend.repo.MailRepo;
import com.example.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class FolderService {
    @Autowired
    private FolderRepo folderRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private MailRepo mailRepo;

    //use lists of ids instead of just one for bulk deleting?

    public Folder createFolder(String userId, String folderName){
        User user = userRepo.findByUserId(userId);
//        System.out.println(user.getUserId());
        Folder folder = new Folder(folderName, user);
        System.out.println("folder created");
        userRepo.save(user);
        return folderRepo.save(folder);
    }

    public void deleteFolder(String userId, String folderId){
        folderRepo.delete(folderRepo.findByFolderId(folderId));
    }

    public void addMail(String userId, String folderId, Mail mail){
        Folder folder = folderRepo.findByFolderId(folderId);
        folder.addMail(mail);
    }

    public void deleteMail(String userId, String folderId, Mail mail){
        Folder folder = folderRepo.findByFolderId(folderId);
        folder.deleteMail(mail);
    }

    public void initialize(String userId) {
        createFolder(userId, "Inbox");
        createFolder(userId, "Drafts");
        createFolder(userId, "Sent");
        createFolder(userId, "Trash");
    }



}
