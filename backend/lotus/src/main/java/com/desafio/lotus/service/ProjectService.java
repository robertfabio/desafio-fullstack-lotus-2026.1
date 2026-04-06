package com.desafio.lotus.service;

import com.desafio.lotus.dto.request.ProjectRequest;
import com.desafio.lotus.dto.response.ProjectResponse;
import com.desafio.lotus.exception.ForbiddenException;
import com.desafio.lotus.exception.ResourceNotFoundException;
import com.desafio.lotus.model.Project;
import com.desafio.lotus.model.User;
import com.desafio.lotus.repository.ProjectRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request, User authenticatedUser) {
        Project project = Project.builder()
                .user(authenticatedUser)
                .name(request.name().trim())
                .description(request.description())
                .deadline(request.deadline())
                .shared(request.shared() != null && request.shared())
                .build();

        Project savedProject = projectRepository.save(project);
        return toProjectResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> findAll(User authenticatedUser) {
        return projectRepository.findAllByUserIdOrSharedTrue(authenticatedUser.getId()).stream()
                .map(this::toProjectResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse findById(UUID id, User authenticatedUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));

        boolean isOwner = project.getUser().getId().equals(authenticatedUser.getId());
        if (!isOwner && !Boolean.TRUE.equals(project.getShared())) {
            throw new ForbiddenException("Você não tem permissão para acessar este projeto");
        }

        return toProjectResponse(project);
    }

    @Transactional
    public ProjectResponse update(UUID id, ProjectRequest request, User authenticatedUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));

        validateOwnership(project, authenticatedUser);

        project.setName(request.name().trim());
        project.setDescription(request.description());
        project.setDeadline(request.deadline());
        project.setShared(request.shared() != null && request.shared());

        Project savedProject = projectRepository.save(project);
        return toProjectResponse(savedProject);
    }

    @Transactional
    public void delete(UUID id, User authenticatedUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));

        validateOwnership(project, authenticatedUser);
        projectRepository.delete(project);
    }

    private void validateOwnership(Project project, User authenticatedUser) {
        boolean isOwner = project.getUser().getId().equals(authenticatedUser.getId());
        if (!isOwner) {
            throw new ForbiddenException("Você não tem permissão para modificar este projeto");
        }
    }

    private ProjectResponse toProjectResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getUser().getId(),
                project.getName(),
                project.getDescription(),
                project.getShared(),
                project.getDeadline(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}
