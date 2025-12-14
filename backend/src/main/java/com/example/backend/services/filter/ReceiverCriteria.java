package com.example.backend.services.filter;

import com.example.backend.model.Mail;

import java.util.List;
import java.util.stream.Collectors;

public class ReceiverCriteria implements MailCriteria {

    private final String keyword;

    public ReceiverCriteria(String keyword) {
        this.keyword = keyword == null ? "" : keyword.toLowerCase();
    }

    @Override
    public List<Mail> meetCriteria(List<Mail> mails) {

        if (keyword.isBlank()) {
            return mails;
        }

        return mails.stream()
                .filter(mail ->
                        mail.getReceiverEmails() != null &&
                                mail.getReceiverEmails().stream()
                                        .anyMatch(email ->
                                                email != null &&
                                                        email.toLowerCase().contains(keyword)
                                        )
                )
                .collect(Collectors.toList());
    }
}
