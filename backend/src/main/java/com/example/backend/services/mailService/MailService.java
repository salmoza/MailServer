package com.example.backend.services.mailService;//package com.example.backend.services;

import com.example.backend.dtos.MailDto;
import com.example.backend.dtos.MailListDto;
import com.example.backend.dtos.MailSearchRequestDto;
import com.example.backend.model.*;
import com.example.backend.mappers.MailFactory;
import com.example.backend.repo.*;
import com.example.backend.services.AttachmentService;
import com.example.backend.services.FolderService;
import com.example.backend.services.filter.*;
import com.example.backend.services.mailService.strategy.*;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MailService {
    @Autowired
    private MailSnapshot mailSnapshot;

    @Autowired
    private MailSnapshotRepo mailSnapshotrepo ;

    @Autowired
    private MailRepo mailRepo;

    private FolderService folderService;
    @Autowired
    public void setFolderService(@Lazy FolderService folderService) {
        this.folderService = folderService;
    }

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FolderRepo folderRepo ;

    @Autowired
    MailFactory mailFactory;

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private MailFilterRepo filterRepo;



    public List<String> createNewMail(MailDto dto) {

        User senderUser = userRepo.findByEmail(dto.getSender());
        if (senderUser == null) throw new RuntimeException("Sender not found");

        String senderId = senderUser.getUserId();

        // Build the complete receiver display names list
        List<String> receiverDisplayNames = new ArrayList<>();
        for (String receiverEmail : dto.getReceivers()) {
            User receiverUser = userRepo.findByEmail(receiverEmail);
            if (receiverUser == null) continue;

            Contact senderContact = senderUser.getContacts().stream()
                    .filter(c -> c.getEmailAddresses().contains(receiverUser.getEmail()))
                    .findFirst()
                    .orElse(null);

            if (senderContact != null) {
                receiverDisplayNames.add(senderContact.getName());
            } else if (receiverUser.getUsername() != null) {
                receiverDisplayNames.add(receiverUser.getUsername());
            } else {
                receiverDisplayNames.add(receiverUser.getEmail());
            }
        }

        // Create sender copy with complete receiver list
        Mail senderCopy = MailFactory.createSenderCopy(senderId, dto);

        // Sender display name (for Sent folder)
        senderCopy.setSenderDisplayName(
                senderUser.getUsername() != null
                        ? senderUser.getUsername()
                        : senderUser.getEmail()
        );

        // Set receiver display names on sender copy
        senderCopy.setReceiverDisplayNames(receiverDisplayNames);

        senderCopy = mailRepo.save(senderCopy);
        folderService.addMail( null ,senderUser.getSentFolderId(), senderCopy);

        List<String> ids = new ArrayList<>();
        ids.add(senderCopy.getMailId());

        // Create receiver copies
        Queue<String> receiversQueue = new LinkedList<>(dto.getReceivers());

        while (!receiversQueue.isEmpty()) {

            String currentReceiverEmail = receiversQueue.poll();

            User receiverUser = userRepo.findByEmail(currentReceiverEmail);
            if (receiverUser == null) continue;

            String receiverId = receiverUser.getUserId();

            // receiver copy
            Mail receiverCopy = MailFactory.createReceiverCopy(receiverId, dto, currentReceiverEmail);

            // Receiver sees sender name
            Contact receiverContact = receiverUser.getContacts().stream()
                    .filter(c -> c.getEmailAddresses().contains(senderUser.getEmail()))
                    .findFirst()
                    .orElse(null);

            if (receiverContact != null) {
                receiverCopy.setSenderDisplayName(receiverContact.getName());
            }
            else if (!senderUser.getUsername().isEmpty()) {
                receiverCopy.setSenderDisplayName(senderUser.getUsername());
            }
            else {
                receiverCopy.setSenderDisplayName(senderUser.getEmail());
            }

            // Set receiver display names on receiver copy too
            receiverCopy.setReceiverDisplayNames(receiverDisplayNames);

            receiverCopy = mailRepo.save(receiverCopy);

            attachmentService.duplicateAttachmentsForNewMail(
                    senderCopy.getMailId(),
                    receiverCopy
            );

            folderService.addMail(null , receiverUser.getInboxFolderId(), receiverCopy);
            applyFilters(receiverCopy, receiverUser.getUserId());

            ids.add(receiverCopy.getMailId());
        }

        return ids;
    }


    public void deleteMailById(String mailId) {
        Mail mail = mailRepo.findByMailId(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));
        for (Folder folder: mail.getFolders()) {
            folder.deleteMail(mail);
        }
        mailRepo.delete(mail);
    }

    @Transactional
    public void deleteMailById(List<String> ids  , String folderId) {

        Queue<String> queue = new LinkedList<>(ids);

        Folder folder = folderRepo.findByFolderId(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        while (!queue.isEmpty()) {

        String mailId = queue.poll();

        Mail mail = mailRepo.findById(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));

            mail.setPreviousFolderId(folderId);
            mailRepo.save(mail);

        folderService.deleteMail( folderId , mail);


        Mail helpingMail = mailRepo.findByMailId(mailId)
                .orElseThrow (() -> new RuntimeException("Mail not found"));

        User user = userRepo.findByUserId(helpingMail.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder trash = folderRepo.findByFolderId(user.getTrashFolderId())
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        if (!mail.getFolders().contains(trash)) {
            trash.addMail(mail);

            /* long thirtyOneDaysAgo = System.currentTimeMillis() - (31L * 24 * 60 * 60 * 1000); // for testing
            mail.setDeletedAt(new Timestamp(thirtyOneDaysAgo)); for testing */

            mail.setDeletedAt(new Timestamp(System.currentTimeMillis()));


            folderRepo.save(trash);
            mailRepo.save(mail);
        } }
    }

    public MailDto mailDetails (String mailId, String folderId) {
        Folder folder = folderRepo.findByFolderId(folderId)
                .orElseThrow (() -> new RuntimeException("Folder not found"));
        Mail mail = mailRepo.findByMailId(mailId)
                .orElseThrow (() -> new RuntimeException("Mail not found"));
        Mail found = folder.getMails().stream().filter(mail1 -> mail1.equals(mail)).findFirst()
                .orElseThrow(() -> new RuntimeException("Mail not found"));

        return mailFactory.toDto(mail, folderId);

    }

//    public List<MailListDto> filterEmails(String folderId, String subject, String sender) {
//
//        List<Mail> emails = mailRepo.getMailsByFolderId(folderId);
//
//        MailCriteria criteria = null;
//
//        if (subject != null) {
//            criteria = (criteria == null)
//                    ? new SubjectCriteria(subject)
//                    : new AndCriteria(criteria, new SubjectCriteria(subject));
//        }
//
//        if (sender != null) {
//            criteria = (criteria == null)
//                    ? new SenderCriteria(sender)
//                    : new AndCriteria(criteria, new SenderCriteria(sender));
//        }
//
//        if (criteria == null)
//            return emails.stream().map(mailFactory::toListDto).toList();
//
//        return criteria.meetCriteria(emails).stream().map(mailFactory::toListDto).toList();
//    }

    public void applyFilters(Mail mail, String userId) {
        System.out.println("in applyFilters");

        List<MailFilter> filters = filterRepo.findByUserUserId(userId);

        for (MailFilter filter : filters) {

            MailCriteria criteria = CriteriaFactory.from(filter);

            if (criteria.matches(mail) && mail.getFolders().size() == 1) {
                this.moveMails(
                        mail.getFolders().get(0).getFolderId(),
                        filter.getTargetFolder(),
                        mail.getMailId().lines().toList()
                );
                break;
            }
        }
    }

    public List<MailListDto> advancedSearch(String folderId, MailSearchRequestDto dto, int page) {

        MailCriteria criteria = null;

        if (dto.getSender() != null && !dto.getSender().isEmpty()) {
            criteria = new SenderCriteria(dto.getSender());
        }

        if (dto.getReceiver() != null && !dto.getReceiver().isEmpty()) {
            MailCriteria receiverCriteria = new ReceiverCriteria(dto.getReceiver());
            criteria = (criteria == null) ? receiverCriteria : new AndCriteria(criteria, receiverCriteria);
        }

        if (dto.getSubject() != null && !dto.getSubject().isEmpty()) {
            MailCriteria subjectCriteria = new SubjectCriteria(dto.getSubject());
            criteria = (criteria == null) ? subjectCriteria : new AndCriteria(criteria, subjectCriteria);
        }

        if (dto.getBody() != null && !dto.getBody().isEmpty()) {
            MailCriteria bodyCriteria = new BodyCriteria(dto.getBody());
            criteria = (criteria == null) ? bodyCriteria : new AndCriteria(criteria, bodyCriteria);
        }
        List<Mail> mails = mailRepo.getMailsByFolderId(folderId);

        if (criteria == null) {
            return paginateMails(mails, page); // no filters, return all
        }

        return paginateMails(criteria.meetCriteria(mails), page);
    }




    public List<MailListDto> searchEmails(String folderId, String keyword, int page) {
        return paginateMails(mailRepo.getMailsByFolderId(folderId).stream()
                .filter(mail -> mail.getSubject().contains(keyword)
                        || mail.getBody().contains(keyword)
                        || mail.getSenderEmail().contains(keyword)
                        || mail.getReceiverEmails().contains(keyword)
                        || mail.getSenderDisplayName().contains(keyword)
                        || mail.getReceiverDisplayNames().contains(keyword)
                )
                .collect(Collectors.toList()), page);
    }


    @Transactional
    public void moveMails(String fromFolderId, String toFolderId, List<String> ids) {
        Queue<String> queue = new LinkedList<>(ids);
        while (!queue.isEmpty()) {
            String mailId = queue.poll();
            Mail mail = mailRepo.findById(mailId)
                    .orElseThrow(() -> new RuntimeException("Mail not found"));
            folderService.addMail( fromFolderId ,toFolderId, mail);
            folderService.deleteMail(fromFolderId,mail);

        }
    }

    public String changeIsRead(String mailId) {
        Mail mail = mailRepo.findByMailId(mailId)
                .orElseThrow(() -> new RuntimeException("Mail not found"));
        mail.setIsRead(true);
        mailRepo.save(mail) ;
        return mailId ;
    }

    public List<MailListDto> sortMails(String folderId, String sortType, int page) {

        List<Mail> mails = mailRepo.getMailsByFolderId(folderId);
        System.out.println(mails);

        MailSortingStrategy strategy;

        switch (sortType.toLowerCase()) {
            case "priority" -> strategy = new SortByPriority();
            case "subject" -> strategy = new SortBySubject();
            case "sender" -> strategy = new SortBySender();
            case "date_asc" -> strategy = new SortByDateAsc();
            default -> strategy = new SortByDateDesc();
        }

        MailSorter sorter = new MailSorter(strategy);

        return paginateMails(sorter.sort(mails), page);
    }

    public List<MailListDto> paginateMails(List<Mail> sortedMails, int page) {
        int size = 20;
        int start = page * size;
        int end = Math.min(start + size, sortedMails.size());

        if (start >= sortedMails.size()) {
            return new ArrayList<>(); // empty page if page number is too high
        }

        return sortedMails.subList(start, end).stream().map(mailFactory::toListDto).toList();
    }


    public void undo(List<String> ids) {
        User user = new User();
        Mail mail = new Mail();
        String id = ids.get(0) ;
        mail = mailRepo.findByMailId(id)
                .orElseThrow(() -> new RuntimeException("Mail not found"));
        user = userRepo.findByUserId(mail.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String trashId = user.getTrashFolderId();
        for (String i : ids ) {
            Mail undoMail = mailRepo.findByMailId(i)
                    .orElseThrow(() -> new RuntimeException("Mail not found"));

            String targetFolderId = undoMail.getPreviousFolderId();


            if (targetFolderId == null) {
                targetFolderId = user.getInboxFolderId();
            }

            else if (!folderRepo.existsById(targetFolderId)) {
                targetFolderId = user.getInboxFolderId();
            }

            undoMail.setDeletedAt(null);
            folderService.addMail( trashId, undoMail.getPreviousFolderId() , undoMail );
            folderService.deleteMail(trashId , undoMail);

        }
    }

    public void deleteForever(List<String> ids) {
        Mail mail = mailRepo.findByMailId(ids.get(0))
                .orElseThrow(() -> new RuntimeException("Mail not found"));
        Folder folder = mail.getFolders().get(0);

        for (String i : ids) {
          Mail deletedMail = mailRepo.findByMailId(i)
                  .orElseThrow(() -> new RuntimeException("Mail not found"));
          folder.deleteMail(deletedMail);
          mailRepo.delete(deletedMail);
        }
        folderRepo.save(folder) ;
    }
}
