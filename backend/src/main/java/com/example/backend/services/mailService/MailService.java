package com.example.backend.services.mailService;//package com.example.backend.services;

import com.example.backend.dtos.MailDto;
import com.example.backend.entities.Folder;
import com.example.backend.entities.Mail;
import com.example.backend.entities.User;
import com.example.backend.factories.MailFactory;
import com.example.backend.repo.FolderRepo;
import com.example.backend.repo.MailRepo;
import com.example.backend.repo.UserRepo;
import com.example.backend.services.AttachmentService;
import com.example.backend.services.FolderService;
import com.example.backend.services.filter.AndCriteria;
import com.example.backend.services.filter.MailCriteria;
import com.example.backend.services.filter.SenderCriteria;
import com.example.backend.services.filter.SubjectCriteria;
import com.example.backend.services.mailService.strategy.MailSorter;
import com.example.backend.services.mailService.strategy.MailSortingStrategy;
import com.example.backend.services.mailService.strategy.SortByDate;
import com.example.backend.services.mailService.strategy.SortByPriority;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MailService {
    @Autowired
    private MailRepo mailRepo;

    @Autowired
    private FolderService folderService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FolderRepo folderRepo ;

    @Autowired
    private AttachmentService attachmentService;
    public List<String> createNewMail(MailDto dto) {



        User senderUser = userRepo.findByEmail(dto.getSender());
        if (senderUser == null) throw new RuntimeException("Sender not found");
        String senderId = senderUser.getUserId();

        Mail senderCopy = MailFactory.create( senderId ,dto , dto.getSender() , "sender"); // has better design ?
        senderCopy.setReceiverEmails(dto.getReceivers());
        senderCopy = mailRepo.save(senderCopy);
        mailRepo.flush();
        folderService.addMail( senderUser.getSentFolderId(), senderCopy);

        Queue<String> receiversQueue = new LinkedList<>();
        if (dto.getReceivers() != null) {
            receiversQueue.addAll(dto.getReceivers());
        }

        List<String> ids= new ArrayList<>();
        ids.add(senderCopy.getMailId());

        while (!receiversQueue.isEmpty()) {

            String currentReceiverEmail = receiversQueue.poll();


            User receiverUser = userRepo.findByEmail(currentReceiverEmail);
            if (receiverUser == null) {
                continue;
            }
            String receiverId = receiverUser.getUserId();

            Mail receiverCopy = MailFactory.create( receiverId ,dto , currentReceiverEmail , "receiver");
            receiverCopy = mailRepo.save(receiverCopy);
            attachmentService.duplicateAttachmentsForNewMail(
                    senderCopy.getMailId(),         // Source: Attachments are linked to the original draft
                    receiverCopy           // Target: Link the new attachment records to the recipient's mail copy
            );
            folderService.addMail( receiverUser.getInboxFolderId(), receiverCopy);
            ids.add(receiverCopy.getMailId());
        }

        return ids;
    }

    @Transactional
    public void deleteMailById(String mailId , String folderId) {

        Folder folder = folderRepo.findByFolderId(folderId) ;
        Mail mail = mailRepo.findById(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));

        folderService.deleteMail( folderId , mail);


        Mail helpingMail = mailRepo.findByMailId(mailId);

        User user = userRepo.findByUserId(helpingMail.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder trash = folderRepo.findByFolderId(user.getTrashFolderId()) ;

        if (!mail.getFolders().contains(trash)) {
            trash.addMail(mail);

            /* long thirtyOneDaysAgo = System.currentTimeMillis() - (31L * 24 * 60 * 60 * 1000); // for testing
            mail.setDeletedAt(new Timestamp(thirtyOneDaysAgo)); for testing */

            mail.setDeletedAt(new Timestamp(System.currentTimeMillis()));


            folderRepo.save(trash);
            mailRepo.save(mail);
        }
    }

    public List<Mail> filterEmails(String folderId, String subject, String sender) {

        List<Mail> emails = mailRepo.getMailsByFolderId(folderId);

        MailCriteria criteria = null;

        if (subject != null) {
            criteria = (criteria == null)
                    ? new SubjectCriteria(subject)
                    : new AndCriteria(criteria, new SubjectCriteria(subject));
        }

        if (sender != null) {
            criteria = (criteria == null)
                    ? new SenderCriteria(sender)
                    : new AndCriteria(criteria, new SenderCriteria(sender));
        }

        if (criteria == null)
            return emails;

        return criteria.meetCriteria(emails);
    }

    public List<Mail> searchEmails(String folderId, String keyword) {
        return mailRepo.getMailsByFolderId(folderId).stream()
                .filter(mail -> mail.getSubject().contains(keyword)
                        || mail.getBody().contains(keyword)
                        || mail.getSenderEmail().contains(keyword)
                        || mail.getReceiverEmails().contains(keyword))
                .collect(Collectors.toList());
    }


    @Transactional
    public void moveMails(String fromFolderId, String toFolderId, List<String> ids) {
        Queue<String> queue = new LinkedList<>(ids);
        while (!queue.isEmpty()) {
            String mailId = queue.poll();
            Mail mail = mailRepo.findById(mailId)
                    .orElseThrow(() -> new RuntimeException("Mail not found"));
            folderService.addMail(toFolderId, mail);
            folderService.deleteMail(fromFolderId,mail);

        }
    }

    public List<Mail> sortMails(String folderId, String sortType) {

        List<Mail> mails = mailRepo.getMailsByFolderId(folderId);
        System.out.println(mails);

        MailSortingStrategy strategy;

        switch (sortType.toLowerCase()) {
            case "priority" -> strategy = new SortByPriority();
            //might implement later
//            case "subject" -> strategy = new SortBySubject();
//            case "sender" -> strategy = new SortBySender();
            default -> strategy = new SortByDate();
        }

        MailSorter sorter = new MailSorter(strategy);
        return sorter.sort(mails);
    }



}
