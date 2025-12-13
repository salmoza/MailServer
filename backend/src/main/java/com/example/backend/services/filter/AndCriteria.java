package com.example.backend.services.filter;

import com.example.backend.model.Mail;

import java.util.List;

public class AndCriteria implements MailCriteria {

    private final MailCriteria c1;
    private final MailCriteria c2;

    public AndCriteria(MailCriteria c1, MailCriteria c2) {
        this.c1 = c1;
        this.c2 = c2;
    }

    @Override
    public List<Mail> meetCriteria(List<Mail> mails) {
        return c2.meetCriteria(c1.meetCriteria(mails));
    }
}
