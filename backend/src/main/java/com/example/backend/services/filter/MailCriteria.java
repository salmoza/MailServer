package com.example.backend.services.filter;

import com.example.backend.model.Mail;

import java.util.List;

public interface MailCriteria {
    public List<Mail> meetCriteria(List<Mail> mails);
}
