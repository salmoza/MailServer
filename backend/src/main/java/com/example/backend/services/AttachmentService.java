package com.example.backend.services;

import com.example.backend.dtos.AttatchmentDto;
import com.example.backend.entities.Attachment;
import com.example.backend.entities.Mail;
import com.example.backend.factories.AttachmentFactory;
import com.example.backend.repo.AttatchemntsRepo;
import com.example.backend.repo.MailRepo;
import com.zaxxer.hikari.util.ClockSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Service
public class AttachmentService {
    private final AttachmentFactory attachmentFactory;
    private final MailRepo mailRepo;
    private final AttatchemntsRepo attatchemntsRepo;

    @Autowired
    public AttachmentService(AttachmentFactory attachmentFactory, MailRepo mailRepo, AttatchemntsRepo attatchemntsRepo) {
        this.attachmentFactory = attachmentFactory;
        this.mailRepo = mailRepo;
        this.attatchemntsRepo = attatchemntsRepo;
    }

    public String createNewAttatchment(AttatchmentDto dto, String mailId) {
        Optional<Mail> mailOptional = mailRepo.findById(mailId);
        if (mailOptional.isEmpty()) {
            throw new IllegalArgumentException("mail is not found");
        }
        Mail parentmail = mailOptional.get();
        Attachment att = attachmentFactory.toEntity(dto);
        att.setMail(parentmail);
        Attachment saveatt = attatchemntsRepo.save(att);

        AttatchmentDto newdto = attachmentFactory.toDTO(saveatt);
        return newdto.getId();
    }

    public String DeleteAttatchemnt(String id) {
       Optional<Attachment> attop = attatchemntsRepo.findById(id);
       if(attop.isEmpty()){
           return "not found";
       }
       Attachment att = attop.get();
       Path filePath = Paths.get(att.getFilePath());
       try{
           if(Files.deleteIfExists(filePath)){
               System.out.println("Deleted physically");
           }
       }catch (IOException e){
           System.err.println("couldn't delete it physically");
       }
       attatchemntsRepo.delete(att);
        return "deleted";
    }
    public Path getfilePath(String attid){
        Optional<Attachment> attop = attatchemntsRepo.findById(attid);
        Attachment att = attop.get();
        return Paths.get(att.getFilePath());
    }
}