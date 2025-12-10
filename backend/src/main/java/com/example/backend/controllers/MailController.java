package com.example.backend.controllers;

import com.example.backend.dtos.MailDto;
import com.example.backend.dtos.MailListDto;
import com.example.backend.entities.Mail;
import com.example.backend.factories.MailFactory;
import com.example.backend.repo.MailRepo;
import com.example.backend.services.mailService.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/mail")
public class MailController {
    @Autowired
    MailService mailService ;

    @Autowired
    MailFactory mailFactory;

    @Autowired
    MailRepo mailRepo ;


    @PostMapping("/compose")
    public ResponseEntity<List<String>> compose (@RequestBody MailDto mailDto) {
        List<String> createdMailIds = mailService.createNewMail(mailDto);
        return ResponseEntity.ok(createdMailIds);
    }

    @GetMapping("/{folderId}/details/{mailId}")
    public MailDto mailDetails (@PathVariable String folderId, @PathVariable String mailId) {
       return mailService.mailDetails(mailId, folderId);
    }

    // delete specific mail
    @DeleteMapping("/delete/{mailId}")
    public ResponseEntity<String> deleteMail (@PathVariable String mailId) {
        mailService.deleteMailById(mailId);
        return ResponseEntity.ok("Mail deleted successfully!");
    }

    // delete folder's mails
    @DeleteMapping("/deleteMails/{folderId}")
    public ResponseEntity<?> deleteMails(@RequestParam List<String> ids , @PathVariable String folderId) {
            mailService.deleteMailById(ids , folderId);

        return ResponseEntity.ok("Deleted " + ids.size() + " mails");
    }

    @PostMapping("/isRead/{mailId}")
    public String changeIsRead (@PathVariable String mailId) {
       return mailService.changeIsRead(mailId) ;

    }

    @GetMapping("/filter")
    public List<MailListDto> filter(
            @RequestParam String folderId,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String sender) {

        return mailService.filterEmails(folderId, subject, sender);
    }


    @GetMapping("/getAllMails")
    public List<MailListDto> getAllMails(@RequestParam String folderId, @RequestParam int page) {
        return mailService.sortMails(folderId, "date", page);

//        return mailRepo.findAll() ;
    }

    @GetMapping("/search")
    public List<MailListDto> search(
            @RequestParam String folderId,
            @RequestParam String keyword,
            @RequestParam int page) {
        return mailService.searchEmails(folderId, keyword, page);
    }

    @PostMapping("/move/{toFolderId}/{fromFolderId}")
    public ResponseEntity<?> move (@PathVariable String fromFolderId
            , @PathVariable String toFolderId
            ,@RequestParam List<String> ids ) {
        mailService.moveMails(fromFolderId , toFolderId , ids) ;
        return ResponseEntity.ok("Moved" + ids.size()) ;
    }

    @GetMapping("/sort")
    public List<MailListDto> sort(
            @RequestParam String folderId,
            @RequestParam String sortBy,
            @RequestParam int page) {
        return mailService.sortMails(folderId, sortBy, page);
    }

    @GetMapping("/mails")
    public List<MailListDto> getAll (){
        return mailRepo.findAll().stream().map(mailFactory::toListDto).toList();
    }    // for testing

    @DeleteMapping("/deleteAllMails")
    public ResponseEntity<String> deleteAll () {
        mailRepo.deleteAll();
        return ResponseEntity.ok("All mails deleted successfully!");
    }



}