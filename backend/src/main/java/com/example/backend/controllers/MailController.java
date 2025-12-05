package com.example.backend.controllers;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Mail;
import com.example.backend.repo.MailRepo;
import com.example.backend.services.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mail")
public class MailController {
    @Autowired
    MailService mailService ;

    @Autowired
    MailRepo mailRepo ;

    @PostMapping("/compose")
    public String compose (@RequestBody MailDto mailDto ) {
        return mailService.createNewMail(mailDto) ;
    }

    @GetMapping("/get")
    public List<Mail> get(){
       return mailRepo.findAll() ;
    }


}
