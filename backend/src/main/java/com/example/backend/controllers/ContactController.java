package com.example.backend.controllers;

import com.example.backend.dtos.ContactDto;
import com.example.backend.services.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/contact")

public class ContactController {

    @Autowired
    ContactService contactService;

    @PostMapping("/create/{userId}")
    public ResponseEntity<ContactDto> createContact(@PathVariable String userId, @Valid @RequestBody ContactDto contactDto) {
        ContactDto created = contactService.createContact(userId, contactDto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/edit/{contactId}")
    public ResponseEntity<ContactDto> editContact (@PathVariable String contactId, @RequestBody ContactDto contactDto) {
        ContactDto edited = contactService.editContact(contactId, contactDto);
        return ResponseEntity.ok(edited);
    }

    @DeleteMapping("/delete/{contactId}")
    public ResponseEntity<String> deleteContact (@PathVariable String contactId) {
        contactService.deleteContact(contactId);
        return ResponseEntity.ok("Contact deleted successfully!");
    }

    @DeleteMapping("/deleteMultipleContacts")
    public ResponseEntity<String> deleteMultipleContacts(@RequestBody List<String> contactIds) {
        contactService.deleteMultipleContacts(contactIds);
        return ResponseEntity.ok("Contacts deleted successfully!");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ContactDto>> getContacts(
            @PathVariable String userId,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String order
    ) {
        List<ContactDto> list = contactService.getContacts(userId, query, sortBy, order);
        return ResponseEntity.ok(list);
    }



    @PutMapping("/{contactId}/star")
    public ResponseEntity<Void> toggleStar (@PathVariable String contactId) {
        contactService.toggleStar(contactId);
        return ResponseEntity.ok().build();
    }
/*
    @GetMapping("/search/{userId}")
    public ResponseEntity<Page<ContactDto>> searchContacts (@PathVariable String userId, @RequestParam String query, Pageable pageable) {
        Page<ContactDto> contacts = contactService.searchContacts(userId, query, pageable);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/sort/{userId}")
    public ResponseEntity<Page<ContactDto>> sortContacts (@PathVariable String userId, @RequestParam(defaultValue = "name") String sortBy, @RequestParam(defaultValue = "asc") String order, Pageable pageable) {
        Page<ContactDto> contacts = contactService.sortContacts(userId, sortBy, order, pageable);
        return ResponseEntity.ok(contacts);
    }
*/

}
