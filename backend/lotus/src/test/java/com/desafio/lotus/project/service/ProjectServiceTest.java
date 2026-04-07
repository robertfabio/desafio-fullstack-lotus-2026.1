package com.desafio.lotus.project.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.desafio.lotus.exception.ForbiddenException;
import com.desafio.lotus.project.dto.response.ProjectSummaryResponse;
import com.desafio.lotus.project.model.Project;
import com.desafio.lotus.project.repository.ProjectRepository;
import com.desafio.lotus.task.model.TaskStatus;
import com.desafio.lotus.task.repository.TaskRepository;
import com.desafio.lotus.user.model.User;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private ProjectService projectService;

    @Test
    void findByIdShouldThrowForbiddenForPrivateProjectOfAnotherUser() {
        UUID projectId = UUID.randomUUID();

        User owner = User.builder().id(UUID.randomUUID()).build();
        User requester = User.builder().id(UUID.randomUUID()).build();

        Project project = Project.builder()
                .id(projectId)
                .user(owner)
                .name("Secret")
                .shared(false)
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        assertThrows(ForbiddenException.class, () -> projectService.findById(projectId, requester));
    }

    @Test
    void findSummaryShouldAggregateTaskCounts() {
        UUID projectId = UUID.randomUUID();
        UUID ownerId = UUID.randomUUID();

        User owner = User.builder().id(ownerId).build();
        Project project = Project.builder()
                .id(projectId)
                .user(owner)
                .name("Board")
                .shared(false)
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(taskRepository.countByProjectId(projectId)).thenReturn(10L);
        when(taskRepository.countByProjectIdAndStatus(projectId, TaskStatus.PENDING)).thenReturn(4L);
        when(taskRepository.countByProjectIdAndStatus(projectId, TaskStatus.IN_PROGRESS)).thenReturn(3L);
        when(taskRepository.countByProjectIdAndStatus(projectId, TaskStatus.DONE)).thenReturn(3L);

        ProjectSummaryResponse summary = projectService.findSummary(projectId, owner);

        assertEquals(10L, summary.total());
        assertEquals(4L, summary.pending());
        assertEquals(3L, summary.inProgress());
        assertEquals(3L, summary.done());
    }
}
