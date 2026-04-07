package com.desafio.lotus.user.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.desafio.lotus.user.dto.request.UpdateUserRequest;
import com.desafio.lotus.exception.EmailAlreadyExistsException;
import com.desafio.lotus.exception.ForbiddenException;
import com.desafio.lotus.user.model.User;
import com.desafio.lotus.user.repository.UserRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void findByIdShouldThrowForbiddenForDifferentUser() {
        UUID targetId = UUID.randomUUID();
        User target = User.builder().id(targetId).build();
        User authenticated = User.builder().id(UUID.randomUUID()).build();

        when(userRepository.findById(targetId)).thenReturn(Optional.of(target));

        assertThrows(ForbiddenException.class, () -> userService.findById(targetId, authenticated));
    }

    @Test
    void updateShouldThrowWhenEmailBelongsToAnotherUser() {
        UUID userId = UUID.randomUUID();
        User existing = User.builder().id(userId).build();
        User authenticated = User.builder().id(userId).build();
        UpdateUserRequest request = new UpdateUserRequest("Alice", "new@mail.com");

        when(userRepository.findById(userId)).thenReturn(Optional.of(existing));
        when(userRepository.existsByEmailAndIdNot("new@mail.com", userId)).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> userService.update(userId, request, authenticated));
    }
}
