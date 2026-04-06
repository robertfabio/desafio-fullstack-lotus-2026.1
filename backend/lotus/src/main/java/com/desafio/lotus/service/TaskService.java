package com.desafio.lotus.service;

import com.desafio.lotus.dto.request.TaskRequest;
import com.desafio.lotus.dto.request.TaskStatusRequest;
import com.desafio.lotus.dto.response.TaskResponse;
import com.desafio.lotus.exception.ForbiddenException;
import com.desafio.lotus.exception.ResourceNotFoundException;
import com.desafio.lotus.model.Project;
import com.desafio.lotus.model.TaskPriority;
import com.desafio.lotus.model.Task;
import com.desafio.lotus.model.TaskStatus;
import com.desafio.lotus.model.User;
import com.desafio.lotus.repository.ProjectRepository;
import com.desafio.lotus.repository.TaskRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public TaskResponse create(TaskRequest request, User authenticatedUser) {
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));

        validateProjectOwnership(project, authenticatedUser);

        Task task = Task.builder()
                .project(project)
                .title(request.title().trim())
                .description(request.description())
                .status(request.status())
                .priority(request.priority())
                .dueDate(request.dueDate())
                .build();

        Task savedTask = taskRepository.save(task);
        return toTaskResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findAll(
            User authenticatedUser,
            TaskStatus status,
            TaskPriority priority,
            UUID projectId,
            LocalDate dueDate
    ) {
        Specification<Task> specification = Specification.where(
                (root, query, cb) -> cb.equal(root.get("project").get("user").get("id"), authenticatedUser.getId())
        );

        if (status != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (priority != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("priority"), priority));
        }

        if (projectId != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("project").get("id"), projectId));
        }

        if (dueDate != null) {
            LocalDateTime endOfDay = dueDate.atTime(23, 59, 59);
            specification = specification.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("dueDate"), endOfDay));
        }

        return taskRepository.findAll(specification).stream()
                .map(this::toTaskResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(UUID id, User authenticatedUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada"));

        validateProjectOwnership(task.getProject(), authenticatedUser);
        return toTaskResponse(task);
    }

    @Transactional
    public TaskResponse update(UUID id, TaskRequest request, User authenticatedUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada"));

        validateProjectOwnership(task.getProject(), authenticatedUser);

        Project newProject = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));
        validateProjectOwnership(newProject, authenticatedUser);

        task.setProject(newProject);
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());

        Task savedTask = taskRepository.save(task);
        return toTaskResponse(savedTask);
    }

    @Transactional
    public TaskResponse patchStatus(UUID id, TaskStatusRequest request, User authenticatedUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada"));

        validateProjectOwnership(task.getProject(), authenticatedUser);

        task.setStatus(request.status());
        Task savedTask = taskRepository.save(task);
        return toTaskResponse(savedTask);
    }

    @Transactional
    public void delete(UUID id, User authenticatedUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada"));

        validateProjectOwnership(task.getProject(), authenticatedUser);
        taskRepository.delete(task);
    }

    private void validateProjectOwnership(Project project, User authenticatedUser) {
        if (!project.getUser().getId().equals(authenticatedUser.getId())) {
            throw new ForbiddenException("Você não tem permissão para acessar esta tarefa");
        }
    }

    private TaskResponse toTaskResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getProject().getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
