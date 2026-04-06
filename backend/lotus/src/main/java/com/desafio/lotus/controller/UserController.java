package com.desafio.lotus.controller;

import com.desafio.lotus.dto.request.UpdateUserRequest;
import com.desafio.lotus.dto.response.UserResponse;
import com.desafio.lotus.model.User;
import com.desafio.lotus.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UserResponse> findAll(Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return userService.findAll(authenticatedUser);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse findById(@PathVariable UUID id, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return userService.findById(id, authenticatedUser);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication
    ) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return userService.update(id, request, authenticatedUser);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        userService.delete(id, authenticatedUser);
    }
}
