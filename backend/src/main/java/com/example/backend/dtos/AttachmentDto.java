package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttachmentDto {
    private String filetype;
    private String id;
    private String mailId;
    private String fileName;
    private Long fileSize;

}