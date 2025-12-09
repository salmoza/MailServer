package com.example.backend.controllers;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Folder;
import com.example.backend.entities.Mail;
import com.example.backend.repo.FolderRepo;
import com.example.backend.repo.MailRepo;
import com.example.backend.services.mailService.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/mail")
public class MailController {
    @Autowired
    MailService mailService ;

    @Autowired
    MailRepo mailRepo ;

    @Autowired
    FolderRepo folderRepo ;

    @PostMapping("/compose")
    public ResponseEntity<List<String>> compose (@RequestBody MailDto mailDto) {
        List<String> createdmailIds = mailService.createNewMail(mailDto);
        return ResponseEntity.ok(createdmailIds);
    }

//    @GetMapping("/{folderId}/mails")
//    public List<Mail> getMails(@PathVariable String folderId) {  // get mails from a specific folder
//        return mailRepo.getMailsByFolderId(folderId);
//    }

    @DeleteMapping("/deleteMails/{folderId}")
    public ResponseEntity<?> deleteMails(@RequestParam List<String> ids , @PathVariable String folderId) {


        Queue<String> queue = new LinkedList<>(ids); //check here what email to be removed first ?

        while (!queue.isEmpty()) {
            String mailId = queue.poll();

            mailService.deleteMailById(mailId , folderId);
        }

        return ResponseEntity.ok("Deleted " + ids.size() + " mails");
    }

    @GetMapping("/filter")
    public List<Mail> filter(
            @RequestParam String folderId,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String sender) {

        return mailService.filterEmails(folderId, subject, sender);
    }


    @GetMapping("/getAllMails")
    public List<Mail> getAllMails(@RequestParam String folderId, @RequestParam int page) {
        return mailService.sortMails(folderId, "date", page);

//        return mailRepo.findAll() ;
    }

    @GetMapping("/search")
    public List<Mail> search(
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
    public List<Mail> sort(
            @RequestParam String folderId,
            @RequestParam String sortBy,
            @RequestParam int page) {
        return mailService.sortMails(folderId, sortBy, page);
    }

     @GetMapping("/mails")
    public List<Mail> getAll (){
        return mailRepo.findAll() ;
    }    // for testing


}
