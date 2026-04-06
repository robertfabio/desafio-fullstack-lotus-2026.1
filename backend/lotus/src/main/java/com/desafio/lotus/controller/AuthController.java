package com.desafio.lotus.controller;

import com.desafio.lotus.dto.request.LoginRequest;
import com.desafio.lotus.dto.request.RegisterRequest;
import com.desafio.lotus.dto.response.AuthResponse;
import com.desafio.lotus.dto.response.MessageResponse;
import com.desafio.lotus.dto.response.UserResponse;
import com.desafio.lotus.model.User;
import com.desafio.lotus.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse me(Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return authService.me(authenticatedUser);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public MessageResponse logout() {
        return authService.logout();
    }
}
