package com.example.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MailFilterDto {
    private String filterId;
    private String filterName;
    private String userId;
    private String field;
    private String value;
    private String targetFolder;
}