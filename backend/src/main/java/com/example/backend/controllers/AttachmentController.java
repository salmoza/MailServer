package com.example.backend.controllers;

import com.example.backend.dtos.AttachmentDto;
import com.example.backend.services.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jackson.autoconfigure.JacksonProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;
    @Autowired
    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }


    @PostMapping
    public ResponseEntity<String> addattachments(@RequestParam("file") MultipartFile file,
                                                        @RequestParam("mailIds") List<String> mailId){
        if(file.isEmpty()){
            throw new IllegalArgumentException("nope");
        }
        try{
            AttachmentDto savedAttachment = attachmentService.createNewAttachment(file,mailId);
            return ResponseEntity.ok(savedAttachment.getId());
        }
       catch (IllegalArgumentException ex){
           throw new IllegalArgumentException("not found");
       } catch (IOException e) {
            System.err.println("file upload failed");
            throw new IllegalArgumentException("nope");
        }
    }
}
