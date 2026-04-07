package com.desafio.lotus.project.controller;

import com.desafio.lotus.project.dto.request.ProjectRequest;
import com.desafio.lotus.project.dto.response.ProjectResponse;
import com.desafio.lotus.project.dto.response.ProjectSummaryResponse;
import com.desafio.lotus.task.dto.response.TaskResponse;
import com.desafio.lotus.task.service.TaskService;
import com.desafio.lotus.user.model.User;
import com.desafio.lotus.project.service.ProjectService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final TaskService taskService;

    public ProjectController(ProjectService projectService, TaskService taskService) {
        this.projectService = projectService;
        this.taskService = taskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return projectService.create(request, authenticatedUser);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProjectResponse> findAll(Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return projectService.findAll(authenticatedUser);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProjectResponse findById(@PathVariable UUID id, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return projectService.findById(id, authenticatedUser);
    }

    @GetMapping("/{id}/tasks")
    @ResponseStatus(HttpStatus.OK)
    public List<TaskResponse> findTasksByProject(@PathVariable UUID id, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return taskService.findAllByProjectId(id, authenticatedUser);
    }

    @GetMapping("/{id}/summary")
    @ResponseStatus(HttpStatus.OK)
    public ProjectSummaryResponse findSummary(@PathVariable UUID id, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return projectService.findSummary(id, authenticatedUser);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProjectResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return projectService.update(id, request, authenticatedUser);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        projectService.delete(id, authenticatedUser);
    }
}

