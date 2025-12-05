package com.example.backend.entities;

import jakarta.persistence.*;

@Entity
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String contactId;
    private String email;
    private String name;

    private String ownerId;

    public Contact() {
    }
}
