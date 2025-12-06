package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;
import org.apache.catalina.User;

import java.util.List;

@Getter
@Setter
public class ContactDto {
    private String contactId;
    private String ownerId;
    private String name;

    private List<String> emailAddresses;
    private boolean isStarred;
    private String phoneNumber;         // optional
    private String notes;               // optional

}
