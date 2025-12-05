package com.example.backend.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDto {
    private String userId;
    private String username;
    private String email;

    // Optional: you can include folder IDs or names if needed
    private List<String> folderIds;

    // Optional: password only for signup
    private String password;
}
