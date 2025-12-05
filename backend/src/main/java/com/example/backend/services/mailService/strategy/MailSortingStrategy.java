package com.example.backend.services.mailService.strategy;

import com.example.backend.entities.Mail;

import java.util.List;

public interface MailSortingStrategy {
    List<Mail> sort(List<Mail> mails);
}
