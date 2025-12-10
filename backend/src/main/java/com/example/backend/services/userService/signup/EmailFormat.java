package com.example.backend.services.userService.signup;

import com.example.backend.services.userService.AuthHandler;
import com.example.backend.services.userService.Request;
import lombok.Setter;


public class EmailFormat extends AuthHandler {

    @Override
    public void validate(Request request) {
        String email = request.getEmail();

        if (!email.contains("@"))
            throw new RuntimeException("Invalid email format");
    }
}

