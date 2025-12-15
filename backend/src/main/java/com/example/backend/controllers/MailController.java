package com.example.backend.controllers;

import com.example.backend.dtos.MailDto;
import com.example.backend.dtos.MailListDto;
import com.example.backend.dtos.MailSearchRequestDto;
import com.example.backend.dtos.MoveMaildto;
import com.example.backend.mappers.MailFactory;
import com.example.backend.repo.MailRepo;
import com.example.backend.services.mailService.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/mails")
public class MailController {
    @Autowired
    MailService mailService ;

    @Autowired
    MailFactory mailFactory;

    @Autowired
    MailRepo mailRepo ;


    @PostMapping
    public ResponseEntity<List<String>> compose (@RequestBody MailDto mailDto) {
        List<String> createdMailIds = mailService.createNewMail(mailDto);
        return ResponseEntity.ok(createdMailIds);
    }

    @GetMapping("/{folderId}/{mailId}")        // details
    public MailDto mailDetails (@PathVariable String folderId, @PathVariable String mailId) {
       return mailService.mailDetails(mailId, folderId);
    }

    // delete folder's mails
    @DeleteMapping("/{folderId}")    // deleteMails
    public ResponseEntity<?> deleteMails(@RequestParam List<String> ids , @PathVariable String folderId) {
            mailService.deleteMailById(ids , folderId);

        return ResponseEntity.ok("Deleted " + ids.size() + " mails");
    }

    @PatchMapping("/{mailId}/read-status")
    public String markAsRead (@PathVariable String mailId) {
       return mailService.changeIsRead(mailId) ;

    }

    @PostMapping("/filter")
    public List<MailListDto> filter(
            @RequestParam String folderId,
            @RequestBody MailSearchRequestDto request,
            @RequestParam int page
    ) {
        return mailService.advancedSearch(folderId, request, page);
    }


    @GetMapping  // getAllMails
    public List<MailListDto> getAllMails(@RequestParam int page, @RequestParam String folderId) {
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

    @PatchMapping("/{toFolderId}/{fromFolderId}")
    public ResponseEntity<?> move (@PathVariable String fromFolderId
            , @PathVariable String toFolderId
            ,@RequestBody MoveMaildto dto ) {
        mailService.moveMails(fromFolderId , toFolderId , dto.getIds()) ;
        return ResponseEntity.ok("Moved" + dto.getIds().size()) ;
    }

    @GetMapping("/sort")
    public List<MailListDto> sort(
            @RequestParam String userId,
            @RequestParam String folderId,
            @RequestParam String sortBy,
            @RequestParam int page) {
        return mailService.sortMails(folderId, sortBy, page);
    }

   /* @GetMapping
    public List<MailListDto> getAll (){
        return mailRepo.findAll().stream().map(mailFactory::toListDto).toList();
    }    // for testing */

    @DeleteMapping
    public ResponseEntity<String> deleteAll () {
        mailRepo.deleteAll();
        return ResponseEntity.ok("All mails deleted successfully!");
    }

    @PatchMapping //undo
    public ResponseEntity<?> undo(@RequestBody List<String> ids) {
        mailService.undo(ids) ;
        return ResponseEntity.ok("successfully") ;
    }



}