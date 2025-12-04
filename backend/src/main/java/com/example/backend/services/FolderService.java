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

@Service
public class FolderService {
    @Autowired
    private FolderRepo folderRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private MailRepo mailRepo;

    //use lists of ids instead of just one for bulk deleting?

    public Folder createFolder(Long userId, String folderName){
        User user = userRepo.findByUserId(userId);
        Folder folder = new Folder(null,folderName, null, null);
        userRepo.save(user);
        return folderRepo.save(folder);
    }

    public void deleteFolder(Long userId, Long folderId){
        folderRepo.delete(folderRepo.findByFolderId(folderId));
    }

    public void addMail(Long userId, Long folderId, Mail mail){
        Folder folder = folderRepo.findByFolderId(folderId);
        folder.addMail(mail);
    }

    public void deleteMail(Long userId, Long folderId, Mail mail){
        Folder folder = folderRepo.findByFolderId(folderId);
        folder.deleteMail(mail);
    }

    public void initialize(Long userId) {
        createFolder(userId, "Inbox");
        createFolder(userId, "Drafts");
        createFolder(userId, "Sent");
        Folder trash = createFolder(userId, "Trash");
        this.autoDelete(trash.getId());
    }

    @Scheduled(fixedDelay = 2592000000L)
    public void autoDelete(Long folderId) {
        Folder folder = folderRepo.findByFolderId(folderId);
        for( Mail mail : folder.getMails() ){
            mailRepo.delete(mail);
        }
    }

}
