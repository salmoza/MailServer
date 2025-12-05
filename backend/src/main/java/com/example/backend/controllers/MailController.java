package com.example.backend.controllers;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Mail;
import com.example.backend.repo.MailRepo;
import com.example.backend.services.mailService.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mail")
public class MailController {
    @Autowired
    MailService mailService ;

    @Autowired
    MailRepo mailRepo ;

    @PostMapping("/compose")
    public String compose (@RequestBody MailDto mailDto ) {
        return mailService.createNewMail(mailDto) ;
    }

    @GetMapping("/{folderId}/mails")
    public List<Mail> getMails(@PathVariable String folderId) {  // get mails from a specific folder
        return mailRepo.getMailsByFolderId(folderId);
    }


}
