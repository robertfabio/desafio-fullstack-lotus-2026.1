package com.desafio.lotus.task.controller;

import com.desafio.lotus.task.dto.request.TaskRequest;
import com.desafio.lotus.task.dto.request.TaskStatusRequest;
import com.desafio.lotus.task.dto.response.TaskResponse;
import com.desafio.lotus.task.model.TaskPriority;
import com.desafio.lotus.task.model.TaskStatus;
import com.desafio.lotus.user.model.User;
import com.desafio.lotus.task.service.TaskService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tasks")
@Validated
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
    public List<TaskResponse> findAll(
            Authentication authentication,
            @RequestParam(required = false)
            @Pattern(
                regexp = "(?i)pending|in_progress|done",
                message = "Status deve ser: pending, in_progress ou done"
            )
            String status,
            @RequestParam(required = false)
            @Pattern(
                regexp = "(?i)low|medium|high",
                message = "Prioridade deve ser: low, medium ou high"
            )
            String priority,
            @RequestParam(name = "project_id", required = false) UUID projectId,
            @RequestParam(name = "due_date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate
    ) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return taskService.findAll(
                authenticatedUser,
                parseStatus(status),
                parsePriority(priority),
                projectId,
                dueDate
        );
    }

    private TaskStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return TaskStatus.fromValue(status);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status invalido");
        }
    }

    private TaskPriority parsePriority(String priority) {
        if (priority == null || priority.isBlank()) {
            return null;
        }
        try {
            return TaskPriority.fromValue(priority);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prioridade invalida");
        }
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

