package com.example.backend.services;



import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.dtos.UserSigninDTO;

import com.example.backend.entities.User;
import com.example.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private FolderService folderService ; //for initialization

    @Autowired
    private PasswordEncoder passwordEncoder;


    public String signIn(UserSigninDTO user) {


        User actualUser = userRepo.findByEmail(user.getEmail());

        if (actualUser == null) {
            return "Email not found";
        }

//        if (!actualUser.getPassword().equals(user.getPassword())) {
//            return "Wrong password";
//        }

        if (!passwordEncoder.matches(user.getPassword(), actualUser.getPassword()))
            return "Wrong password";

        return actualUser.getUserId();
    }


    public String signUp(UserSignupDTO user) {

        if (userRepo.existsByEmail(user.getEmail())) {
            return "Email already exists";
        }

        User newUser = new User();
        newUser.setEmail(user.getEmail());
//        newUser.setPassword(user.getPassword());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setDisplayName(user.getUsername());

        userRepo.save(newUser);
        folderService.initialize(newUser.getUserId());

        return newUser.getUserId();
    }


    public List<User> getAllUsers() {
        return userRepo.findAll() ;
    }


}
