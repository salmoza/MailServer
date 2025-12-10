package com.example.backend.services.userService.signin;

import com.example.backend.entities.User;
import com.example.backend.repo.UserRepo;
import com.example.backend.services.userService.AuthHandler;
import com.example.backend.services.userService.Request;


public class PasswordMatch extends AuthHandler {
    private final UserRepo userRepo;

    public PasswordMatch(UserRepo repo) {
        this.userRepo = repo;
    }

    @Override
    public void validate(Request request) {
        User user = userRepo.findByEmail(request.getEmail());

        if (!user.getPassword().equals(request.getPassword()))
            throw new RuntimeException("Wrong password");

    }
}

