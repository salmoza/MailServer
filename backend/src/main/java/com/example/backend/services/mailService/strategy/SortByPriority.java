package com.example.backend.services.mailService.strategy;


import com.example.backend.model.Mail;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public class SortByPriority implements MailSortingStrategy {
    @Override
    public List<Mail> sort(List<Mail> mails) {

        // Create a PriorityQueue sorted by mail priority
        PriorityQueue<Mail> pq = new PriorityQueue<>(
                Comparator.comparingInt(Mail::getPriority)
        );

        pq.addAll(mails);

        // Extract in sorted order
        List<Mail> sortedList = new ArrayList<>();
        while (!pq.isEmpty()) {
            sortedList.add(pq.poll());
        }

        return sortedList;
    }
}
