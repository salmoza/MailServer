package com.example.backend.mappers;

import com.example.backend.dtos.UserDto;
import com.example.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserFactory {


    @Autowired
    ContactFactory contactFactory;
    public UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());

        if (user.getContacts() != null) {
            dto.setContacts(
                    user.getContacts().stream()
                            .map(contactFactory::toDto)
                            .toList()
            );
        }
        dto.setFolders(user.getFolders());

        return dto;
    }


    public User toEntity (UserDto dto) {
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        user.setContacts(
                dto.getContacts().stream()
                        .map(contactDto -> contactFactory.toEntity(contactDto, user))
                        .toList()
        );
        user.setFolders(dto.getFolders());
        return user;
    }
}
