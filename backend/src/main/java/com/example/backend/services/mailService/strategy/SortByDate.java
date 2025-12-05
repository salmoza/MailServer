package com.example.backend.services.mailService.strategy;

import com.example.backend.entities.Mail;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

//default sort
public class SortByDate implements MailSortingStrategy {
    public List<Mail> sort(List<Mail> mails) {
        return mails.stream()
                .sorted(Comparator.comparing(Mail::getDate).reversed())
                .collect(Collectors.toList());
    }
}