package com.example.backend.services.userService;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class Request {
    private String email;
    private String password;

    public Request(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
