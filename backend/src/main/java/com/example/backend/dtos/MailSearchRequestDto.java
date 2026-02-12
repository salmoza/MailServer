package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailSearchRequestDto {
    private String sender;
    private String receiver;
    private String subject;
    private String body;
}
