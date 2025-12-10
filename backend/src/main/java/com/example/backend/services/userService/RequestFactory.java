package com.example.backend.services.userService;


import com.example.backend.services.userService.signin.SignInRequest;
import com.example.backend.services.userService.signup.SignUpRequest;

public class RequestFactory {

    public static Request createRequest(String type, String username, String email, String password) {
        return switch (type.toLowerCase()) {
            case "signup" -> new SignUpRequest(username, email, password);
            case "signin" -> new SignInRequest(email, password);
            default -> throw new IllegalArgumentException("Unknown request type: " + type);
        };
    }
}

