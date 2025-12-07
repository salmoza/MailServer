package com.example.backend.services;

import com.example.backend.dtos.AttachmentDto;
import com.example.backend.entities.Attachment;
import com.example.backend.entities.Mail;
import com.example.backend.factories.AttachmentFactory;
import com.example.backend.repo.AttachmentRepo;
import com.example.backend.repo.MailRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class AttachmentService {
    private final AttachmentFactory attachmentFactory;
    private final MailRepo mailRepo;
    private final AttachmentRepo attachmentsRepo;

    @Autowired
    public AttachmentService(AttachmentFactory attachmentFactory, MailRepo mailRepo, AttachmentRepo attachmentsRepo) {
        this.attachmentFactory = attachmentFactory;
        this.mailRepo = mailRepo;
        this.attachmentsRepo = attachmentsRepo;
    }

    public String createNewAttachment(AttachmentDto dto, String mailId) {
        Optional<Mail> mailOptional = mailRepo.findById(mailId);
        if (mailOptional.isEmpty()) {
            throw new IllegalArgumentException("mail is not found");
        }
        Mail parentmail = mailOptional.get();
        Attachment att = attachmentFactory.toEntity(dto);
        att.setMail(parentmail);
        Attachment saveatt = attachmentsRepo.save(att);

        AttachmentDto newdto = attachmentFactory.toDTO(saveatt);
        return newdto.getId();
    }

    public String DeleteAttachment(String id) {
        List<Attachment> attop = attachmentsRepo.findByAttachmentId(id);
        if(attop.isEmpty()){
            return "not found";
        }
        Attachment att = attop.get(Integer.parseInt(id));
        Path filePath = Paths.get(att.getFilePath());
        try{
            if(Files.deleteIfExists(filePath)){
                System.out.println("Deleted physically");
            }
        }catch (IOException e){
            System.err.println("couldn't delete it physically");
        }
        attachmentsRepo.delete(att);
        return "deleted";
    }
    public Path getfilePath(String attid){
        Optional<Attachment> attop = attachmentsRepo.findById(attid);
        Attachment att = attop.get();
        return Paths.get(att.getFilePath());
    }
}