package com.example.backend.services;



import com.example.backend.dtos.UserIdWithFoldersIdDto;
import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.dtos.UserSigninDTO;

import com.example.backend.entities.User;
import com.example.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FolderService folderService ; //for initialization

    @Autowired
    UserIdWithFoldersIdDto userIdWithFoldersIdDto ;


    public UserIdWithFoldersIdDto signIn(UserSigninDTO user) {


        User actualUser = userRepo.findByEmail(user.getEmail());

        if (actualUser == null) {
            throw new IllegalArgumentException("Email not found") ;
        }


        if (!(user.getPassword().equals(actualUser.getPassword()))) {
            throw new IllegalArgumentException("Wrong password");
        }
        userIdWithFoldersIdDto.setUserId(actualUser.getUserId());
        userIdWithFoldersIdDto.setInboxId(actualUser.getInboxFolderId());
        userIdWithFoldersIdDto.setSentId(actualUser.getSentFolderId());
        userIdWithFoldersIdDto.setTrashId(actualUser.getTrashFolderId());
        userIdWithFoldersIdDto.setDraftsId(actualUser.getDraftsFolderId());
        return userIdWithFoldersIdDto ;
    }


    public UserSignupDTO signUp(UserSignupDTO user) {

        if (userRepo.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setDisplayName(user.getUsername());

        userRepo.save(newUser);
        folderService.initialize(newUser.getUserId());
        UserSignupDTO saveduser = new UserSignupDTO();
        saveduser.setEmail(newUser.getEmail());
        saveduser.setUsername(newUser.getDisplayName());
        return saveduser;
    }


    public List<User> getAllUsers() {
        return userRepo.findAll() ;
    }


}