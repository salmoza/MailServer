package com.example.backend.services.mailService.strategy;


import com.example.backend.model.Mail;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class SortBySender implements MailSortingStrategy {

    @Override
    public List<Mail> sort(List<Mail> mails) {

        List<Mail> sorted = new ArrayList<>(mails);

        sorted.sort(
                Comparator.comparing(
                        mail -> mail.getSenderDisplayName() == null ? "" : mail.getSenderDisplayName(),
                        String.CASE_INSENSITIVE_ORDER
                )
        );

        return sorted;
    }
}