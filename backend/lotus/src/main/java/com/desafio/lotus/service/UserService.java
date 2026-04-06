package com.desafio.lotus.service;

import com.desafio.lotus.dto.request.UpdateUserRequest;
import com.desafio.lotus.dto.response.UserResponse;
import com.desafio.lotus.exception.EmailAlreadyExistsException;
import com.desafio.lotus.exception.ForbiddenException;
import com.desafio.lotus.exception.ResourceNotFoundException;
import com.desafio.lotus.model.User;
import com.desafio.lotus.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll(User authenticatedUser) {
        return List.of(toUserResponse(authenticatedUser));
    }

    @Transactional(readOnly = true)
    public UserResponse findById(UUID id, User authenticatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        validateOwnership(user.getId(), authenticatedUser);
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse update(UUID id, UpdateUserRequest request, User authenticatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        validateOwnership(user.getId(), authenticatedUser);

        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailAndIdNot(normalizedEmail, user.getId())) {
            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        User savedUser = userRepository.save(user);

        return toUserResponse(savedUser);
    }

    @Transactional
    public void delete(UUID id, User authenticatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        validateOwnership(user.getId(), authenticatedUser);
        userRepository.delete(user);
    }

    private void validateOwnership(UUID targetUserId, User authenticatedUser) {
        if (!targetUserId.equals(authenticatedUser.getId())) {
            throw new ForbiddenException("Você não tem permissão para acessar este recurso");
        }
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}
