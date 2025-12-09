package com.example.backend.controllers;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Mail;
import com.example.backend.entities.MailSnapshot;
import com.example.backend.services.mailService.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/draft")
public class DraftController {
    @Autowired
    MailService mailService ;


    @PostMapping("/save")
    public ResponseEntity<Mail> saveDraft(@RequestBody MailDto mailDto) {
        return ResponseEntity.ok(mailService.saveDraft(mailDto));
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<List<Mail>> getDrafts(@PathVariable String userId) {
        return ResponseEntity.ok(mailService.getDrafts(userId));
    }

    @PutMapping("/update/{mailId}")
    public ResponseEntity<Mail> updateDraft(@PathVariable String mailId, @RequestBody MailDto dto) {
        return ResponseEntity.ok(mailService.updateDraft(mailId, dto));
    }

    @GetMapping("/snapshots/{mailId}")
    public ResponseEntity<List<MailSnapshot>> getSnapshots(@PathVariable String mailId) {
        return ResponseEntity.ok(mailService.getSnapshots(mailId));
    }

    @PostMapping("/send/{mailId}")
    public ResponseEntity<?> sendDraft(@PathVariable String mailId) {
        mailService.sendDraft(mailId);
        return ResponseEntity.ok("Draft sent successfully");
    }
}

