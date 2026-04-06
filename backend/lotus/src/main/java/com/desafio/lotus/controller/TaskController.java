package com.desafio.lotus.controller;

import com.desafio.lotus.dto.request.TaskRequest;
import com.desafio.lotus.dto.request.TaskStatusRequest;
import com.desafio.lotus.dto.response.TaskResponse;
import com.desafio.lotus.model.User;
import com.desafio.lotus.service.TaskService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody TaskRequest request, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return taskService.create(request, authenticatedUser);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<TaskResponse> findAll(Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return taskService.findAll(authenticatedUser);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TaskResponse findById(@PathVariable UUID id, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return taskService.findById(id, authenticatedUser);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TaskResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return taskService.update(id, request, authenticatedUser);
    }

    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.OK)
    public TaskResponse patchStatus(
            @PathVariable UUID id,
            @Valid @RequestBody TaskStatusRequest request,
            Authentication authentication
    ) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return taskService.patchStatus(id, request, authenticatedUser);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        taskService.delete(id, authenticatedUser);
    }
}
