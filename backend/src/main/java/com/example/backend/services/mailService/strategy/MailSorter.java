package com.example.backend.services.mailService.strategy;


import com.example.backend.entities.Mail;
import java.util.List;

public class MailSorter {
    private MailSortingStrategy strategy;

    public MailSorter(MailSortingStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(MailSortingStrategy strategy) {
        this.strategy = strategy;
    }

    public List<Mail> sort(List<Mail> mails) {
        return strategy.sort(mails);
    }
}
