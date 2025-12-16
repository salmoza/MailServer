package com.example.backend.controllers;

import com.example.backend.dtos.MailDto;
import com.example.backend.model.Mail;
import com.example.backend.model.MailSnapshot;
import com.example.backend.services.DraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/drafts")
public class DraftController {
    @Autowired
    DraftService draftService;


    @PostMapping
    public ResponseEntity<String> saveDraft(@RequestBody MailDto mailDto) {
        return ResponseEntity.ok(draftService.saveDraft(mailDto).getMailId());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Mail>> getDrafts(@PathVariable String userId) {
        return ResponseEntity.ok(draftService.getDrafts(userId));
    }

    @PutMapping("/{mailId}")
    public ResponseEntity<Mail> updateDraft(@PathVariable String mailId, @RequestBody MailDto dto) {
        return ResponseEntity.ok(draftService.updateDraft(mailId, dto));
    }
    @GetMapping("/{mailId}/snapshots")
    public ResponseEntity<List<MailSnapshot>> getSnapshots(@PathVariable String mailId) {
        return ResponseEntity.ok(draftService.getSnapshots(mailId));
    }

    @PostMapping("/{mailId}/send")
    public ResponseEntity<?> sendDraft(@PathVariable String mailId) {
        draftService.sendDraft(mailId);
        return ResponseEntity.ok("Draft sent successfully");
    }

    @DeleteMapping
    public ResponseEntity<?> deleteForever (@RequestBody List<String> ids) {
        draftService.deleteForever(ids);
        return ResponseEntity.ok("successfully deleted");

    }
}

