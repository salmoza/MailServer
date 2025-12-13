package com.example.backend.repo;

import com.example.backend.model.MailFilter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MailFilterRepo extends JpaRepository<MailFilter, String> {

    List<MailFilter> findByUserUserId(String userId);
    List<MailFilter> getFilterByFilterId(String filterId);
}
