package com.desafio.lotus.task.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.desafio.lotus.exception.ResourceNotFoundException;
import com.desafio.lotus.project.model.Project;
import com.desafio.lotus.project.repository.ProjectRepository;
import com.desafio.lotus.task.dto.request.TaskStatusRequest;
import com.desafio.lotus.task.dto.response.TaskResponse;
import com.desafio.lotus.task.model.Task;
import com.desafio.lotus.task.model.TaskPriority;
import com.desafio.lotus.task.model.TaskStatus;
import com.desafio.lotus.task.repository.TaskRepository;
import com.desafio.lotus.user.model.User;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void createShouldThrowWhenProjectDoesNotExist() {
        User authenticated = User.builder().id(UUID.randomUUID()).build();
        var request = new com.desafio.lotus.task.dto.request.TaskRequest(
                "Title",
                "Description",
                TaskStatus.PENDING,
                TaskPriority.HIGH,
                LocalDateTime.now().plusDays(1),
                UUID.randomUUID()
        );

        when(projectRepository.findById(request.projectId())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.create(request, authenticated));
    }

    @Test
    void patchStatusShouldUpdateAndReturnResponse() {
        UUID ownerId = UUID.randomUUID();
        UUID projectId = UUID.randomUUID();
        UUID taskId = UUID.randomUUID();

        User owner = User.builder().id(ownerId).build();
        Project project = Project.builder().id(projectId).user(owner).build();

        Task existingTask = Task.builder()
                .id(taskId)
                .project(project)
                .title("Task")
                .description("Desc")
                .status(TaskStatus.PENDING)
                .priority(TaskPriority.MEDIUM)
                .build();

        Task savedTask = Task.builder()
                .id(taskId)
                .project(project)
                .title("Task")
                .description("Desc")
                .status(TaskStatus.DONE)
                .priority(TaskPriority.MEDIUM)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        TaskResponse response = taskService.patchStatus(taskId, new TaskStatusRequest(TaskStatus.DONE), owner);

        assertEquals(taskId, response.id());
        assertEquals(TaskStatus.DONE, response.status());
    }
}
