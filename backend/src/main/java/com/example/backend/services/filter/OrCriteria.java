//package com.example.backend.services.filter;
//
//
//import com.example.backend.model.Mail;
//
//import java.util.List;
//import java.util.stream.Collectors;
//import java.util.stream.Stream;
//
//public class OrCriteria implements MailCriteria {
//
//    private final MailCriteria c1;
//    private final MailCriteria c2;
//
//    public OrCriteria(MailCriteria c1, MailCriteria c2) {
//        this.c1 = c1;
//        this.c2 = c2;
//    }
//
//    @Override
//    public List<Mail> meetCriteria(List<Mail> mails) {
//        List<Mail> list1 = c1.meetCriteria(mails);
//        List<Mail> list2 = c2.meetCriteria(mails);
//
//        return Stream.concat(list1.stream(), list2.stream())
//                .distinct()
//                .collect(Collectors.toList());
//    }
//}
