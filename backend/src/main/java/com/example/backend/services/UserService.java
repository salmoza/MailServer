package com.example.backend.services;



import com.example.backend.dtos.UserDto;
import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.dtos.UserSigninDTO;

import com.example.backend.entities.User;
import com.example.backend.factories.UserFactory;
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
    UserFactory userFactory;

    @Autowired
    private FolderService folderService ; //for initialization



    public User signIn(UserSigninDTO user) {


        User actualUser = userRepo.findByEmail(user.getEmail());

        if (actualUser == null) {
            throw new IllegalArgumentException("Email not found") ;
        }


        if (!(user.getPassword().equals(actualUser.getPassword()))) {
            throw new IllegalArgumentException("Wrong password");
        }
        return actualUser;
    }


    public User signUp(UserSignupDTO user) {

        if (userRepo.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setUsername(user.getUsername());

        User savedUser=userRepo.save(newUser);
        folderService.initialize(savedUser.getUserId());
        User fullyinitialized = userRepo.findByUserId(savedUser.getUserId()).
                orElseThrow(()-> new RuntimeException("idk"));
        return fullyinitialized;
    }


    public List<UserDto> getAllUsers() {
        return userRepo.findAll().stream()
                .map(user -> userFactory.toDto(user))
                .toList();
    }


}