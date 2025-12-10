package com.example.backend.services.userService.signin;

import com.example.backend.services.userService.Request;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignInRequest extends Request {
    public SignInRequest(String email, String password) {
        super(email, password);
    }
}
