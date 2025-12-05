package com.example.backend.services;



import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.dtos.UserSigninDTO;

import com.example.backend.entities.User;
import com.example.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FolderService folderService ; //for initialization


    public String signin(UserSigninDTO user) {


        User userOptional = userRepo.findByEmail(user.getEmail());


        if (userOptional == null ) {
           return "Email not found";
        }


        User actualUser = userOptional ;


        if (!actualUser.getPassword().equals(user.getPassword())) {
            throw new IllegalArgumentException("Wrong password");
        }

        return actualUser.getUserId();
    }


    public ResponseEntity<String> signup(UserSignupDTO user) {

        if (userRepo.existsByEmail(user.getEmail())) {
            return ResponseEntity.ofNullable("Email already exists");
        }

        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setUsername(user.getUsername());

        userRepo.save(newUser);
        folderService.initialize(newUser.getUserId());

        return ResponseEntity.ok(newUser.getUserId());
//        return "User created successfully";
    }


    public List<User> getAllUsers() {
        return userRepo.findAll() ;
    }


}
