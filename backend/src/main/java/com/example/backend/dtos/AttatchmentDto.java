package com.example.backend.dtos;

import com.example.backend.entities.Mail;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttatchmentDto {
    private String filetype;
    private String filePath;
    private String id;
    private String mailId;

}
