package com.example.backend.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupDTO {

    // making it optional
//    @NotBlank(message = "username is required")
//    @Size(min = 3, max = 30 , message = "Username must be between 3,30 letters to be accepted")
    private String username ;

    @NotBlank(message = "email is required")
    @Email(message = "email is not valid")
    private String email ;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$",
            message = "Password must contain an uppercase letter, a lowercase letter, and a number"
    )
    private String password ;


}
