package com.example.backend.controllers;

import com.example.backend.dtos.MailDto;
import com.example.backend.services.mailService.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mail")
public class MailController {
    @Autowired
    MailService mailService ;

    @PostMapping("/compose")
    public String compose (@RequestBody MailDto mailDto ) {
        return mailService.createNewMail(mailDto) ;
    }


}
