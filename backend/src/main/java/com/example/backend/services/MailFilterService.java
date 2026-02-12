package com.example.backend.services;

import com.example.backend.model.MailFilter;
import com.example.backend.repo.MailFilterRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MailFilterService {

    @Autowired
    private MailFilterRepo mailFilterRepository;

    public List<MailFilter> getAllFilters(String userId) {
        return mailFilterRepository.findByUserUserId(userId);
    }

    public MailFilter getFilterById(String filterId) {
        return mailFilterRepository.findById(filterId)
                .orElseThrow(() -> new RuntimeException("Filter not found with ID: " + filterId));
    }

    public MailFilter createFilter(MailFilter filter) {

        return mailFilterRepository.save(filter);
    }

    public MailFilter updateFilter(MailFilter filter) {
        return mailFilterRepository.save(filter);
    }

    public void deleteFilter(String filterId) {
        mailFilterRepository.deleteById(filterId);
    }

}