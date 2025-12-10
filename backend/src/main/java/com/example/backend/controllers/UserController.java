package com.example.backend.controllers;

import com.example.backend.dtos.UserSigninDTO;
import com.example.backend.dtos.UserSignupDTO;

import com.example.backend.dtos.UserDto;
import com.example.backend.dtos.UserSigninDTO;
import com.example.backend.dtos.UserSignupDTO;
import com.example.backend.entities.User;
import com.example.backend.services.userService.RequestFactory;
import com.example.backend.services.userService.UserService;
import com.example.backend.services.userService.signin.SignInRequest;
import com.example.backend.services.userService.signup.SignUpRequest;
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


//    @PostMapping("/signIn")
//    public ResponseEntity<?> signin (@RequestBody UserSigninDTO user) {
//        return ResponseEntity.ok(userService.signIn(user));
//    }
    @PostMapping("/signIn")
    public ResponseEntity<?> signin(@RequestBody UserSigninDTO dto) {
        try {
            SignInRequest req =
                    (SignInRequest) RequestFactory.createRequest("signin",
                            null, dto.getEmail(), dto.getPassword());
            return ResponseEntity.ok(userService.signIn(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handelAuthException(IllegalArgumentException ex){
        return Map.of("error",ex.getMessage());
    }
    @PostMapping("/signUp")
//    public ResponseEntity<?>  signup (@Valid @RequestBody UserSignupDTO user) {
//        return ResponseEntity.ok(userService.signUp(user)) ;
//    }
    public ResponseEntity<?> signup(@RequestBody UserSignupDTO dto) {
        try {
            SignUpRequest req =
                    (SignUpRequest) RequestFactory.createRequest("signup", dto.getUsername(), dto.getEmail(), dto.getPassword());
            return ResponseEntity.ok(userService.signUp(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
    public List<UserDto> get (){
        return userService.getAllUsers() ;
    }

}