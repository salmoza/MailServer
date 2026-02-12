package com.example.backend.services.filter;

import com.example.backend.model.Mail;

import java.util.List;

public interface MailCriteria {

    List<Mail> meetCriteria(List<Mail> mails);

    default boolean matches(Mail mail) {
        return meetCriteria(List.of(mail)).size() == 1;
    }
}
