package com.example.backend.dtos;

import com.example.backend.model.Folder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDto {
    private String userId;
    private String email;

    private String username;

    private String password;

    private List<Folder> folders;
    private List<ContactDto> contacts;

}
