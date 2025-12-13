package com.example.backend.controllers;

import com.example.backend.dtos.MailFilterDto;
import com.example.backend.factories.MailFilterMapper;
import com.example.backend.model.MailFilter;
import com.example.backend.services.MailFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/filters")
@CrossOrigin(origins = "http://localhost:4200")
public class MailFilterController {

    @Autowired
    private MailFilterService filterService;

    @Autowired
    private MailFilterMapper filterMapper;

    // GET ALL filters for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<MailFilterDto>> getAllFilters(@PathVariable String userId) {
        List<MailFilter> filters = filterService.getAllFilters(userId);
        List<MailFilterDto> dtos = filters.stream()
                .map(filterMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // GET single filter
    @GetMapping("/filter/{filterId}")
    public ResponseEntity<MailFilterDto> getFilter(@PathVariable String filterId) {
        MailFilter filter = filterService.getFilterById(filterId);
        return ResponseEntity.ok(filterMapper.toDTO(filter));
    }

    // CREATE new filter
    @PostMapping
    public ResponseEntity<MailFilterDto> createFilter(@RequestBody MailFilterDto filterDTO) {
        MailFilter filter = filterMapper.toEntity(filterDTO);
        MailFilter savedFilter = filterService.createFilter(filter);
        return ResponseEntity.ok(filterMapper.toDTO(savedFilter));
    }

    // UPDATE filter
    @PutMapping("/{filterId}")
    public ResponseEntity<MailFilterDto> updateFilter(
            @PathVariable String filterId,
            @RequestBody MailFilterDto filterDTO) {
        MailFilter existingFilter = filterService.getFilterById(filterId);
        filterMapper.updateEntityFromDTO(filterDTO, existingFilter);
        MailFilter updatedFilter = filterService.updateFilter(existingFilter);
        return ResponseEntity.ok(filterMapper.toDTO(updatedFilter));
    }

    // DELETE filter
    @DeleteMapping("/{filterId}")
    public ResponseEntity<Void> deleteFilter(@PathVariable String filterId) {
        filterService.deleteFilter(filterId);
        return ResponseEntity.noContent().build();
    }
}
