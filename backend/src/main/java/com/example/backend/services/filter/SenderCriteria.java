package com.example.backend.services.filter;


import com.example.backend.model.Mail;

import java.util.List;
import java.util.stream.Collectors;

public class SenderCriteria implements MailCriteria {

    private final String sender;

    public SenderCriteria(String sender) {
        this.sender = sender.toLowerCase();
    }

    @Override
    public List<Mail> meetCriteria(List<Mail> emails) {
        return emails.stream()
                .filter(email -> email.getSenderEmail().equalsIgnoreCase(sender))
                .collect(Collectors.toList());
    }
}
