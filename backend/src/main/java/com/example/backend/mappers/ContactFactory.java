package com.example.backend.mappers;

import com.example.backend.dtos.ContactDto;
import com.example.backend.model.Contact;
import com.example.backend.model.User;
import org.springframework.stereotype.Service;

@Service
public class ContactFactory {
    public ContactDto toDto(Contact contact) {
        ContactDto contactDto = new ContactDto();
        contactDto.setContactId(contact.getContactId());
        contactDto.setName(contact.getName());
        contactDto.setStarred(contact.isStarred());
        contactDto.setOwnerId(contact.getOwner().getUserId());
        contactDto.setEmailAddresses(contact.getEmailAddresses());
        contactDto.setNotes(contact.getNotes());
        contactDto.setPhoneNumber(contact.getPhoneNumber());
        return contactDto;
    }

    public Contact toEntity (ContactDto contactDto, User owner) {
        Contact contact = new Contact();
        contact.setName(contactDto.getName());
        contact.setStarred(contactDto.isStarred());
        contact.setOwner(owner);
        contact.setEmailAddresses(contactDto.getEmailAddresses());
        contact.setNotes(contactDto.getNotes());
        contact.setPhoneNumber(contactDto.getPhoneNumber());
        return contact;
    }
}
