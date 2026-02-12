package com.example.backend.services.mailService.strategy;

import com.example.backend.model.Mail;

import java.util.Comparator;
import java.util.List;

//default sort
public class SortByDateAsc implements MailSortingStrategy {
    @Override
    public List<Mail> sort(List<Mail> mails) {
        return mails.stream()
                .sorted(Comparator.comparing(Mail::getDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }
}
