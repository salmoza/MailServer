package com.example.backend.services.mailService;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Mail;
import com.example.backend.entities.User;
import com.example.backend.factories.MailFactory;
import com.example.backend.repo.MailRepo;
import com.example.backend.repo.UserRepo;
import com.example.backend.services.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    @Autowired
    private MailRepo mailRepo;

    @Autowired
    private FolderService folderService;

    @Autowired
    private UserRepo userRepo;

    public String createNewMail(MailDto dto) {


        Mail mail = MailFactory.create(dto);

        mail.setUserId(userRepo.findByEmail(dto.getSender()).getUserId());


        mail = mailRepo.save(mail);

        User sender = userRepo.findByEmail(dto.getSender()) ;

        folderService.addMail(sender.getUserId() , sender.getSentFolderId(), mail);


        User receiver = userRepo.findByEmail(dto.getReceiver());
        folderService.addMail(receiver.getUserId(), receiver.getInboxFolderId(), mail);

        return mail.getMailId();
    }
}
