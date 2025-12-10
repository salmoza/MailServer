package com.example.backend.services.userService;



import com.example.backend.dtos.UserDto;
//import com.example.backend.dtos.UserSignupDTO;
//import com.example.backend.dtos.UserSigninDTO;

import com.example.backend.entities.User;
import com.example.backend.factories.UserFactory;
import com.example.backend.repo.UserRepo;
import com.example.backend.services.FolderService;
import com.example.backend.services.userService.signin.*;
import com.example.backend.services.userService.signup.EmailFormat;
import com.example.backend.services.userService.signup.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    UserFactory userFactory;

    @Autowired
    private FolderService folderService ; //for initialization


    public String signUp(SignUpRequest request) {
        System.out.println("signUp");

        AuthHandler handler = new EmailFormat();
        handler.setNext(new EmailDuplication(userRepo)).setNext(new PasswordStrength());
        handler.handle(request);

        System.out.println("signUp2");

        User newUser = new User();
        System.out.println("signUp3");

        newUser.setEmail(request.getEmail());
        System.out.println(request.getEmail());

        newUser.setPassword(request.getPassword());
        System.out.println(request.getPassword());

        newUser.setUsername(request.getUsername());
        System.out.println(request.getUsername());

        User savedUser=userRepo.save(newUser);
        System.out.println("savedUser");

        folderService.initialize(savedUser.getUserId());
//        User fullyinitialized = userRepo.findByUserId(savedUser.getUserId()).
//                orElseThrow(()-> new RuntimeException("idk"));
//        return fullyinitialized;

        return "Signup successful";
    }

    public User signIn(SignInRequest request) {
        AuthHandler handler = new EmailExistence(userRepo);
        handler.setNext(new PasswordMatch(userRepo));
        handler.handle(request);

        return userRepo.findByEmail(request.getEmail());
    }



//    public User signIn(UserSigninDTO user) {
//
//
//        User actualUser = userRepo.findByEmail(user.getEmail());
//
//        if (actualUser == null) {
//            throw new IllegalArgumentException("Email not found") ;
//        }
//
//
//        if (!(user.getPassword().equals(actualUser.getPassword()))) {
//            throw new IllegalArgumentException("Wrong password");
//        }
//        return actualUser;
//    }
//
//
//    public User signUp(UserSignupDTO user) {
//
//        if (userRepo.existsByEmail(user.getEmail())) {
//            throw new IllegalArgumentException("Email already exists");
//        }
//
//        User newUser = new User();
//        newUser.setEmail(user.getEmail());
//        newUser.setPassword(user.getPassword());
//        newUser.setUsername(user.getUsername());
//
//        User savedUser=userRepo.save(newUser);
//        folderService.initialize(savedUser.getUserId());
//        User fullyinitialized = userRepo.findByUserId(savedUser.getUserId()).
//                orElseThrow(()-> new RuntimeException("idk"));
//        return fullyinitialized;
//    }


    public List<UserDto> getAllUsers() {
        return userRepo.findAll().stream()
                .map(user -> userFactory.toDto(user))
                .toList();
    }


}