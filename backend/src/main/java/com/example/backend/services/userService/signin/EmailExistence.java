package com.example.backend.services.userService.signin;

import com.example.backend.repo.UserRepo;
import com.example.backend.services.userService.AuthHandler;
import com.example.backend.services.userService.Request;
import lombok.Setter;

@Setter
public class EmailExistence extends AuthHandler {

    private final UserRepo userRepo;

    public EmailExistence(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public void validate(Request request) {
        System.out.println("in email existence");
        if (!userRepo.existsByEmail(request.getEmail()))
            throw new RuntimeException("User not found");
    }
}

