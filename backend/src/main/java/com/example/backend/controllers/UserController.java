package com.example.backend.controllers;

//import com.example.backend.dtos.UserSigninDTO;
//import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.dtos.UserSigninDTO;
import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.entities.User;
import com.example.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService ;


    @PostMapping("/signin")
    public String signin (@RequestBody UserSigninDTO user) {
        return userService.signin(user) ;
    }

    @PostMapping("/signup")
    public ResponseEntity<?>  signup (@Valid @RequestBody UserSignupDTO user) {
        String result = userService.signup(user) ;
        return ResponseEntity.ok(result) ;
    }


    @GetMapping("/get")
    public List<User> get (){
        return userService.getAllUsers() ;
    }

}
