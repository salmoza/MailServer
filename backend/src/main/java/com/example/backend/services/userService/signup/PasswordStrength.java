package com.example.backend.services.userService.signup;

import com.example.backend.services.userService.AuthHandler;
import com.example.backend.services.userService.Request;

public class PasswordStrength extends AuthHandler {

    @Override
    public void validate(Request request) {
        String pass = request.getPassword();

        if (pass.length() < 8)
            throw new RuntimeException("Password must be at least 8 characters");

        if (!pass.matches(".*[A-Z].*"))
            throw new RuntimeException("Password must contain an uppercase letter");

        if (!pass.matches(".*[a-z].*"))
            throw new RuntimeException("Password must contain a lowercase letter");

        if (!pass.matches(".*[0-9].*"))
            throw new RuntimeException("Password must contain a number");

        if (!pass.matches(".*[!@#$%^&*()].*"))
            throw new RuntimeException("Password must contain a special character");
    }
}
