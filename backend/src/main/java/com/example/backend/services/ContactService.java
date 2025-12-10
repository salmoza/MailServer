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

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    @Autowired
    private ContactsRepo contactsRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ContactFactory contactFactory;

    public ContactDto createContact (String userId, ContactDto dto) {
        User owner = userRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Contact contact = contactFactory.toEntity(dto, owner);
        contact = contactsRepo.save(contact);

        return contactFactory.toDto(contact);
//        return contactFactory.toDto(contact);
    }

    public ContactDto editContact (String contactId, ContactDto dto) {
        Contact contact = contactsRepo.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

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


    public List<ContactDto> getContacts(String userId, String query, String sortBy, String order) {
        User owner = userRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Contact> contacts = contactsRepo.findByOwner(owner);

        //SEARCH (optional)
        if (query != null && !query.isEmpty()) {
            String q = query.toLowerCase();

            contacts = contacts.stream()
                    .filter(contact ->
                            (contact.getName() != null &&
                                    contact.getName().toLowerCase().contains(q)) ||
                                    (contact.getNotes() != null &&
                                            contact.getNotes().toLowerCase().contains(q)) ||
                                    (contact.getPhoneNumber() != null &&
                                            contact.getPhoneNumber().toLowerCase().contains(q)) ||
                                    (contact.getEmailAddresses() != null &&
                                            contact.getEmailAddresses().stream()
                                                    .anyMatch(email -> email.toLowerCase().contains(q)))
                    )
                    .toList();
        }

        // SORTING (optional)
        if (sortBy != null && !sortBy.isEmpty()) {

            Comparator<Contact> comparator = switch (sortBy) {
                case "name" -> Comparator.comparing(
                        Contact::getName,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                case "phoneNumber" -> Comparator.comparing(
                        Contact::getPhoneNumber,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                case "notes" -> Comparator.comparing(
                        Contact::getNotes,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );

                case "createdAt" -> Comparator.comparing(Contact::getCreatedAt);
                case "updatedAt" -> Comparator.comparing(Contact::getUpdatedAt);
                case "starred" -> Comparator.comparing(Contact::isStarred);
                default -> throw new RuntimeException("Unknown sort field: " + sortBy);
            };

            if ("desc".equalsIgnoreCase(order)) {
                comparator = comparator.reversed();
            }

            contacts = contacts.stream().sorted(comparator).toList();
        }

        // Convert to DTO
        return contacts.stream()
                .map(contactFactory::toDto)
                .toList();
    }


//    public Page<ContactDto> sortContacts(String userId, String sortBy, String order, Pageable pageable) {
//
//        User owner = userRepo.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//
//        Sort sort = order.equalsIgnoreCase("asc")
//                ? Sort.by(sortBy).ascending()
//                : Sort.by(sortBy).descending();
//
//        Pageable sortedPageable = org.springframework.data.domain.PageRequest.of(
//                pageable.getPageNumber(),
//                pageable.getPageSize(),
//                sort
//        );
//
//
//        Page<Contact> contacts = contactsRepo.findByOwner(owner, sortedPageable);
//
//        return contacts.map(contactFactory::toDto);
//    }


//    public Page<ContactDto> searchContacts (String userId, String query, Pageable pageable) {
//        User owner = userRepo.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Page<Contact> result = contactsRepo.searchContacts(owner, query, pageable);
//
//        return result.map(contactFactory::toDto);
//
//    }

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

