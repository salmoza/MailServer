package com.example.backend.services.filter;

import com.example.backend.model.Mail;

import java.util.List;
import java.util.stream.Collectors;

public class SubjectCriteria implements MailCriteria {

    private final String keyword;

    public SubjectCriteria(String keyword) {
        this.keyword = keyword.toLowerCase();
    }

    @Override
    public List<Mail> meetCriteria(List<Mail> emails) {
        return emails.stream()
                .filter(email -> email.getSubject() != null &&
                        email.getSubject().toLowerCase().contains(keyword))
                .collect(Collectors.toList());
    }
}