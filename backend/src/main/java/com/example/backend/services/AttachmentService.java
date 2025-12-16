package com.example.backend.services;

import com.example.backend.dtos.AttachmentDto;
import com.example.backend.model.Attachment;
import com.example.backend.model.Mail;
import com.example.backend.mappers.AttachmentFactory;
import com.example.backend.repo.AttachmentsRepo;
import com.example.backend.repo.MailRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AttachmentService {
    private final AttachmentFactory attachmentFactory;
    private final MailRepo mailRepo;
    private final AttachmentsRepo attachmentsRepo;
    private static final String Attachment_dir = "C:\\Users\\Zuhair\\Desktop\\Server\\attachments";
    @Autowired
    public AttachmentService(AttachmentFactory attachmentFactory, MailRepo mailRepo, AttachmentsRepo attachmentsRepo) {
        this.attachmentFactory = attachmentFactory;
        this.mailRepo = mailRepo;
        this.attachmentsRepo = attachmentsRepo;
    }

    public AttachmentDto createNewAttachment(MultipartFile file, List<String> mailId) throws IOException {
        if (mailId == null || mailId.isEmpty()) {
            throw new IllegalArgumentException("mail is not found");
        }
        String PrimaryMailId = mailId.get(0);
        Path mailSepcificPath = Paths.get(Attachment_dir,PrimaryMailId);
        Files.createDirectories(mailSepcificPath);

        String uniquename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = mailSepcificPath.resolve(uniquename);
        Files.copy(file.getInputStream(), filePath);

        String pathString = filePath.toString();
        Long fileSize = file.getSize();
        String filetype = file.getContentType();
        String originalName = file.getOriginalFilename();
        AttachmentDto primaryAttachmentdto = null;
        for(String mailid: mailId){
            Optional<Mail> mailOptional = mailRepo.findById(mailid);
            Mail parentMail = mailOptional.orElseThrow(()-> new IllegalArgumentException("mail id not found"));
            Attachment att = new Attachment();
            att.setMail(parentMail);
            att.setFilePath(pathString);
            att.setFilesize(fileSize);
            att.setFiletype(filetype);
            att.setFilename(originalName);
            Attachment saveAtt = attachmentsRepo.save(att);
            if(primaryAttachmentdto == null){
                primaryAttachmentdto = attachmentFactory.toDTO(saveAtt);
            }
        }
        return primaryAttachmentdto;
    }

    public String DeleteAttachment(String id) {
       Optional<Attachment> attop = attachmentsRepo.findById(id);
       if(attop.isEmpty()){
           return "not found";
       }
       Attachment att = attop.get();
       Mail parent = att.getMail();
       if(parent != null){
           parent.getAttachments().remove(att);
           mailRepo.save(parent);
       }
       att.setMail(null);
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
    public List<Attachment> duplicateAttachmentsForNewMail(String sourceDraftId, Mail targetMailEntity) {

        // 1. Find all attachments currently linked to the source Draft ID
        List<Attachment> sourceAttachments = attachmentsRepo.findByAttachmentId(sourceDraftId); // Assuming you defined this method in AttachmentsRepo

        List<Attachment> duplicatedAttachments = new ArrayList<>();

        for (Attachment sourceAtt : sourceAttachments) {
            // 2. Create a brand new Attachment Entity (A clone of the metadata)
            Attachment newAtt = new Attachment();

            // Copy all necessary data (FilePath is shared, as the file is already on disk)
            newAtt.setFilename(sourceAtt.getFilename());
            newAtt.setFiletype(sourceAtt.getFiletype());
            newAtt.setFilesize(sourceAtt.getFilesize());
            newAtt.setFilePath(sourceAtt.getFilePath()); // Path is SHARED

            // 3. Set the NEW Foreign Key link (CRITICAL)
            newAtt.setMail(targetMailEntity); // Links to the recipient's new mail ID

            // 4. Save the new attachment record (JPA generates a new UUID)
            Attachment savedAtt = attachmentsRepo.save(newAtt);
            duplicatedAttachments.add(savedAtt);
        }

        return duplicatedAttachments;
    }
    public Resource loadFileAsResource(String attachmentId) throws IOException{
        Attachment attachment = attachmentsRepo.findById(attachmentId).orElseThrow(()->new RuntimeException("file not found"));
        Path filePath = Paths.get(attachment.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        if(resource.exists() && resource.isReadable()){
            return resource;
        }
        else{
            throw new RuntimeException("could not read file: "+attachment.getFilename());
        }
    }
    public Attachment getAttachmentMeta(String id){
        return attachmentsRepo.findById(id).orElseThrow(()-> new RuntimeException("Not Found"));
    }
}