package com.example.backend.specifications;

import com.example.backend.entities.Mail;

import java.util.List;

public interface MailCriteria {
    public List<Mail> meetCriteria(List<Mail> mails);
}
