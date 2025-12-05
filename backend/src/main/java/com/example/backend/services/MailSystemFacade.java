//package com.example.backend.services;
//
//@Service
//public class MailSystemFacade {
//    @Autowired
//    private MailService mailService;
//
//    @Autowired
//    private FolderService folderService;
//
//    @Autowired
//    private AttachmentService attachmentService;
//
//    public void sendMail(Mail mail) {
//        mailService.validateMail(mail);
//        mailService.saveMail(mail);
//        mailService.notifyReceivers(mail);
//    }
//
//    public void moveMail(Long mailId, Long folderId) {
//        folderService.addMailToFolder(folderId, mailService.getMailById(mailId));
//    }
//
//    public void deleteMail(Long mailId) {
//        mailService.deleteMail(mailId);
//    }
//}
