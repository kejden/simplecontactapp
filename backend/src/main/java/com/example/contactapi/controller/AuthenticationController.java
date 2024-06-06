package com.example.contactapi.controller;


import com.example.contactapi.dto.LoginResponseDto;
import com.example.contactapi.dto.RegistrationDto;
import com.example.contactapi.model.User;
import com.example.contactapi.service.AuthenticationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public User userRegister(@RequestBody RegistrationDto body) {
        return authenticationService.registerUser(body.getUsername(), body.getPassword());
    }

    @PostMapping("/login")
    public LoginResponseDto loginUser(@RequestBody RegistrationDto body) {
        return authenticationService.loginUser(body.getUsername(), body.getPassword());
    }

}
