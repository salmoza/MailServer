package com.example.backend.services;

import com.example.backend.dtos.AttachmentDto;
import com.example.backend.entities.Attachment;
import com.example.backend.entities.Mail;
import com.example.backend.factories.AttachmentFactory;
import com.example.backend.repo.AttachmentsRepo;
import com.example.backend.repo.MailRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AttachmentService {
    private final AttachmentFactory attachmentFactory;
    private final MailRepo mailRepo;
    private final AttachmentsRepo attachmentsRepo;
    private static final String Attachment_dir = "server/attachments";
    @Autowired
    public AttachmentService(AttachmentFactory attachmentFactory, MailRepo mailRepo, AttachmentsRepo attachmentsRepo) {
        this.attachmentFactory = attachmentFactory;
        this.mailRepo = mailRepo;
        this.attachmentsRepo = attachmentsRepo;
    }

    public AttachmentDto createNewAttachment(MultipartFile file, String mailId) throws IOException {
        Optional<Mail> mailOptional = mailRepo.findById(mailId);
        if (mailOptional.isEmpty()) {
            throw new IllegalArgumentException("mail is not found");
        }
        Mail parentmail = mailOptional.get();
        Path mailSepcificPath = Paths.get(Attachment_dir,mailId);
        Files.createDirectories(mailSepcificPath);

        String uniquename = UUID.randomUUID().toString()+"_"+file.getOriginalFilename();
        Path filePath = mailSepcificPath.resolve(uniquename);

        Files.copy(file.getInputStream(),filePath);

        Attachment att = new Attachment();
        att.setMail(parentmail);
        att.setFiletype(file.getContentType());
        att.setFilePath(filePath.toString());
        att.setFilesize(file.getSize());
        att.setFilename(file.getOriginalFilename());
        Attachment saveatt = attachmentsRepo.save(att);

        return attachmentFactory.toDTO(saveatt);
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