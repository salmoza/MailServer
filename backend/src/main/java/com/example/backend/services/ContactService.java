package com.example.backend.services;

import com.example.backend.dtos.ContactDto;
import com.example.backend.entities.Contact;
import com.example.backend.factories.ContactFactory;
import com.example.backend.repo.ContactsRepo;
import com.example.backend.repo.UserRepo;
import com.example.backend.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {
    @Autowired
    private ContactsRepo contactsRepo;

    @Autowired
    private UserRepo userRepo;

//    @Autowired
    private ContactFactory contactFactory =  new ContactFactory();

    public ContactDto createContact (String userId, ContactDto dto) {
        User owner = userRepo.findByUserId(userId)
                .orElseThrow (() -> new RuntimeException("User not found"));

        Contact contact = contactFactory.toEntity(dto, owner);
        contact = contactsRepo.save(contact);

        return contactFactory.toDto(contact);
    }

    public ContactDto editContact (String contactId, ContactDto dto) {
        Contact contact = contactsRepo.findById(contactId)
                        .orElseThrow (() -> new RuntimeException("Contact not found"));

        contact.setName(dto.getName());
        contact.setEmailAddresses(dto.getEmailAddresses());
        contact.setNotes(dto.getNotes());
        contact.setPhoneNumber(dto.getPhoneNumber());
        contact.setStarred(dto.isStarred());
        contact = contactsRepo.save(contact);

        return contactFactory.toDto(contact);
    }

    public void deleteContact (String contactId) {
        Contact contact = contactsRepo.findById(contactId)
                .orElseThrow  (() -> new RuntimeException("Contact not found"));
        contactsRepo.delete(contact);
    }

    public Page<ContactDto> searchContacts (String userId, String query, Pageable pageable) {
        User owner = userRepo.findByUserId(userId)
                .orElseThrow (() -> new RuntimeException("User not found"));
        Page<Contact> result;
        if (query.contains("@")) {
            result = contactsRepo.findByOwnerAndEmailAddressContaining(owner, query, pageable);
        }else {
            result = contactsRepo.findByOwnerAndNameContainingIgnoreCase(owner, query, pageable);
        }
        return result.map(contactFactory::toDto);

    }

    public Page<ContactDto> sortContacts(String userId, String sortBy, String order, Pageable pageable) {

        User owner = userRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sort sort = order.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable sortedPageable = org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );


        Page<Contact> contacts = contactsRepo.findByOwner(owner, sortedPageable);

        return contacts.map(contactFactory::toDto);
    }

    public void deleteMultipleContacts(List<String> contactIds) {
        for (String contactId : contactIds) {
            contactsRepo.deleteById(contactId);
        }
    }

    public void toggleStar(String contactId) {
        Contact contact = contactsRepo.findById(contactId)
                .orElseThrow  (() -> new RuntimeException("Contact not found"));
        contact.setStarred(!contact.isStarred());
        contactsRepo.save(contact);
    }

}

