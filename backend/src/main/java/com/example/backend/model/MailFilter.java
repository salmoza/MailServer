package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mail_filters")
public class MailFilter {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String filterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private String filterName;
    private String field;
    private String operator;
    private String filterValue;
    private String targetFolder;

    public MailFilter() {}
}