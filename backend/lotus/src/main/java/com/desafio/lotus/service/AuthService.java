package com.desafio.lotus.service;

import com.desafio.lotus.dto.request.LoginRequest;
import com.desafio.lotus.dto.request.RegisterRequest;
import com.desafio.lotus.dto.response.AuthResponse;
import com.desafio.lotus.dto.response.MessageResponse;
import com.desafio.lotus.dto.response.UserResponse;
import com.desafio.lotus.exception.EmailAlreadyExistsException;
import com.desafio.lotus.exception.InvalidCredentialsException;
import com.desafio.lotus.model.User;
import com.desafio.lotus.repository.UserRepository;
import com.desafio.lotus.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.password()))
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);

        UserResponse userResponse = toUserResponse(savedUser);
        return new AuthResponse(token, userResponse);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Credenciais inválidas"));

        boolean passwordMatches = passwordEncoder.matches(request.password(), user.getPassword());
        if (!passwordMatches) {
            throw new InvalidCredentialsException("Credenciais inválidas");
        }

        String token = jwtUtil.generateToken(user);
        UserResponse userResponse = toUserResponse(user);
        return new AuthResponse(token, userResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse me(User authenticatedUser) {
        return toUserResponse(authenticatedUser);
    }

    public MessageResponse logout() {
        return new MessageResponse("Logout realizado com sucesso");
    }

    private UserResponse toUserResponse(User user) {
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );
        return userResponse;
    }
}
