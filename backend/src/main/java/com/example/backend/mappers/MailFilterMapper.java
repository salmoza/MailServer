package com.example.backend.mappers;

import com.example.backend.dtos.MailFilterDto;
import com.example.backend.model.MailFilter;
import com.example.backend.model.User;
import com.example.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MailFilterMapper {

    @Autowired
    private UserRepo userRepo;

    public MailFilterDto toDTO(MailFilter filter) {
        if (filter == null) {
            return null;
        }

        MailFilterDto dto = new MailFilterDto();
        dto.setFilterId(filter.getFilterId());
        dto.setFilterName(filter.getFilterName());
        dto.setUserId(filter.getUser().getUserId());
        dto.setField(filter.getField());
        dto.setFilterValue(filter.getFilterValue());
        dto.setTargetFolder(filter.getTargetFolder());

        return dto;
    }

    /**
     * Convert MailFilterDTO to MailFilter entity
     */
    public MailFilter toEntity(MailFilterDto dto) {
        if (dto == null) {
            return null;
        }

        MailFilter filter = new MailFilter();
        filter.setFilterId(dto.getFilterId());
        filter.setFilterName(dto.getFilterName());
        filter.setField(dto.getField());
        filter.setFilterValue(dto.getFilterValue());
        filter.setTargetFolder(dto.getTargetFolder());

        // Fetch and set the User object
        if (dto.getUserId() != null) {
            User user = userRepo.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));
            filter.setUser(user);
        }

        return filter;
    }

    public void updateEntityFromDTO(MailFilterDto dto, MailFilter filter) {
        if (dto == null || filter == null) {
            return;
        }

        if (dto.getFilterName() != null) {
            filter.setFilterName(dto.getFilterName());
        }

        if (dto.getField() != null) {
            filter.setField(dto.getField());
        }

        if (dto.getFilterValue() != null) {
            filter.setFilterValue(dto.getFilterValue());
        }

        if (dto.getTargetFolder() != null) {
            filter.setTargetFolder(dto.getTargetFolder());
        }

        // Update user if userId is provided and different
        if (dto.getUserId() != null &&
                (filter.getUser() == null || !filter.getUser().getUserId().equals(dto.getUserId()))) {
            User user = userRepo.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));
            filter.setUser(user);
        }
    }
}