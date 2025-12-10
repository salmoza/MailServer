package com.example.backend.services.userService.signup;

import com.example.backend.services.userService.Request;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequest extends Request {
    private String username;

    public SignUpRequest(String username, String email, String password) {
        super(email, password);
        this.username = username;
    }
}

