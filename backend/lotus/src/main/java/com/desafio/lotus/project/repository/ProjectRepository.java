package com.desafio.lotus.project.repository;

import com.desafio.lotus.project.model.Project;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findAllByUserId(UUID userId);

    List<Project> findAllByUserIdOrSharedTrue(UUID userId);

    Optional<Project> findByIdAndUserId(UUID id, UUID userId);
}

