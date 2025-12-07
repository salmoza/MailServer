package com.example.backend.controllers;

//import com.example.backend.dtos.UserSigninDTO;
//import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.dtos.UserSigninDTO;
import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.entities.User;
import com.example.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService ;


    @PostMapping("/signIn")
    public ResponseEntity<Map<String, String>> signIn (@RequestBody UserSigninDTO user) {
        String userid = userService.signin(user);
        return ResponseEntity.ok(Map.of("userId",userid,"message","Login successful."));
    }


    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handelAuthException(IllegalArgumentException ex){
        return Map.of("error",ex.getMessage());
    }
    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@Valid @RequestBody UserSignupDTO user) {
        return ResponseEntity.ok(userService.signup(user)) ;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex){
        String fistError = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Validation failed");
        return Map.of("error",fistError);
    }

    @GetMapping("/get")
    public List<User> get (){
        return userService.getAllUsers() ;
    }

}