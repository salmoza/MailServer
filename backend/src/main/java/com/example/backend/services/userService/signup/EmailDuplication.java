package com.example.backend.services.userService.signup;

import com.example.backend.repo.UserRepo;
import com.example.backend.services.userService.AuthHandler;
import com.example.backend.services.userService.Request;


public class EmailDuplication extends AuthHandler {

    private UserRepo userRepo;

    public EmailDuplication(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public void validate(Request request) {
        System.out.println("EmailDuplication");
        if (userRepo.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exists");
    }
}
