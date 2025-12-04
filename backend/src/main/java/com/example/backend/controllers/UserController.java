package com.example.backend.controllers;

import com.example.backend.dtos.UserSigninDTO;
import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.entities.User;
import com.example.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService ;


    @PostMapping("/signin")
    public String signin (@RequestBody  UserSigninDTO user) {
        return userService.signin(user) ;
    }

    @PostMapping("/signup")
    public String signup (@RequestBody  UserSignupDTO user) {
        return userService.signup(user) ;
    }

    /* For getting all the users
    @GetMapping("/get")
    public List<User> get (){
        return userService.getAllUsers() ;
    }
 */
}
