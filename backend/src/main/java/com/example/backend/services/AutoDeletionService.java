package com.example.backend.services;

import com.example.backend.entities.Folder;
import com.example.backend.entities.Mail;
import com.example.backend.entities.User;
import com.example.backend.repo.FolderRepo;
import com.example.backend.repo.MailRepo;
import com.example.backend.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

import java.util.List;

@Service
public class AutoDeletionService {
    @Autowired
    private MailRepo mailRepo;

    @Autowired
    private FolderRepo folderRepo;

    @Autowired
    UserRepo userRepo;

    @Transactional

    //@Scheduled(fixedRate = 300000)  for testing
    @Scheduled(cron = "0 0 3 * * *")
    public void deleteOldMails() {

        List<User> users = userRepo.findAll() ;

        for (User user : users) {

        Folder trash = folderRepo.findByFolderNameAndUserUserId("Trash" , user.getUserId()) ;
        if(trash == null ) {continue;}

        List<Mail> toDelete = trash.getMails()
                .stream()
                .filter(mail -> mail.getDeletedAt() != null &&
                        mail.getDeletedAt().before(
                                new Timestamp(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000)
                        )
                )
                .toList();

        for (Mail mail : toDelete) {
            trash.deleteMail(mail);
            mailRepo.delete(mail);
        }

        folderRepo.save(trash);
    }
    } }
