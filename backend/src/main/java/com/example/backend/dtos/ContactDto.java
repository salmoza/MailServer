package com.example.backend.dtos;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;


import java.util.List;

@Getter
@Setter
public class ContactDto {
    private String contactId;
    private String ownerId;

    @NotBlank(message = "Contact name is required")
    @Size(min = 3, message = "Contact name must be at least 3 characters")
    private String name;

    @NotEmpty(message = "Email list cannot be empty")
    private List<@Email(message = "Invalid email format")String> emailAddresses;
    private boolean starred;

    @Pattern(regexp = "\\d+", message = "Phone number must contain digits only")
    private String phoneNumber;         // optional
    private String notes;               // optional

}
