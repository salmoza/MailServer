package com.example.backend.dtos;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserIdWithFoldersIdDto {
    private String userId;
    private String inboxId;
    private String sentId ;
    private String trashId ;
    private String draftsId ;
}
