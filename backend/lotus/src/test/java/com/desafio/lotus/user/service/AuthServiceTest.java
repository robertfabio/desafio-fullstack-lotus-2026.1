package com.desafio.lotus.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.desafio.lotus.user.dto.request.LoginRequest;
import com.desafio.lotus.user.dto.request.RegisterRequest;
import com.desafio.lotus.user.dto.response.AuthResponse;
import com.desafio.lotus.exception.EmailAlreadyExistsException;
import com.desafio.lotus.exception.InvalidCredentialsException;
import com.desafio.lotus.security.JwtUtil;
import com.desafio.lotus.user.model.User;
import com.desafio.lotus.user.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerShouldNormalizeAndReturnToken() {
        RegisterRequest request = new RegisterRequest("  Alice  ", "  ALICE@MAIL.COM  ", "123456");

        UUID userId = UUID.randomUUID();
        User savedUser = User.builder()
                .id(userId)
                .name("Alice")
                .email("alice@mail.com")
                .password("encoded")
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.existsByEmail("alice@mail.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(savedUser)).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertEquals("jwt-token", response.token());
        assertEquals("alice@mail.com", response.user().email());
        assertEquals("Alice", response.user().name());
        assertNotNull(response.user().id());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("Alice", userCaptor.getValue().getName());
        assertEquals("alice@mail.com", userCaptor.getValue().getEmail());
        assertEquals("encoded", userCaptor.getValue().getPassword());
    }

    @Test
    void registerShouldThrowWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("Alice", "alice@mail.com", "123456");
        when(userRepository.existsByEmail("alice@mail.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
    }

    @Test
    void loginShouldThrowWhenPasswordDoesNotMatch() {
        LoginRequest request = new LoginRequest("alice@mail.com", "wrong-pass");
        User user = User.builder()
                .id(UUID.randomUUID())
                .name("Alice")
                .email("alice@mail.com")
                .password("encoded")
                .build();

        when(userRepository.findByEmail("alice@mail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-pass", "encoded")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }
}
