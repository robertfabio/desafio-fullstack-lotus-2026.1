package com.desafio.lotus.repository;

import com.desafio.lotus.model.Task;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findAllByProjectId(UUID projectId);

    List<Task> findAllByProjectUserId(UUID userId);

    List<Task> findTop5ByProjectUserIdAndDueDateIsNotNullAndStatusNotOrderByDueDateAsc(
            UUID userId,
            com.desafio.lotus.model.TaskStatus status
    );

    long countByProjectId(UUID projectId);

    long countByProjectIdAndStatus(UUID projectId, com.desafio.lotus.model.TaskStatus status);

    List<Task> findAllByProjectUserIdAndDueDateLessThanEqual(UUID userId, LocalDateTime dueDate);
}
