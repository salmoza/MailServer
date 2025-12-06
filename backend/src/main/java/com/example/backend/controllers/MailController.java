package com.example.backend.controllers;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Mail;
import com.example.backend.repo.MailRepo;
import com.example.backend.services.mailService.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

@RestController
@RequestMapping("/mail")
public class MailController {
    @Autowired
    MailService mailService ;

    @Autowired
    MailRepo mailRepo ;

    @PostMapping("/compose")
    public String compose (@RequestBody MailDto mailDto) {
        return mailService.createNewMail(mailDto) ;
    }

    @GetMapping("/{folderId}/mails")
    public List<Mail> getMails(@PathVariable String folderId) {  // get mails from a specific folder
        return mailRepo.getMailsByFolderId(folderId);
    }

    @DeleteMapping("/deleteMails/{folderId}")
    public ResponseEntity<?> deleteMails(@RequestParam List<String> ids , @PathVariable String folderId) {

        Queue<String> queue = new LinkedList<>(ids); //check here what email to be removed first ?

        while (!queue.isEmpty()) {
            String mailId = queue.poll();
            mailService.deleteMailById(mailId , folderId);
        }

        return ResponseEntity.ok("Deleted " + ids.size() + " mails");
    }

}
