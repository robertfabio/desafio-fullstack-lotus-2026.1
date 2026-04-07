package com.desafio.lotus.user.service;

import com.desafio.lotus.user.dto.request.LoginRequest;
import com.desafio.lotus.user.dto.request.RegisterRequest;
import com.desafio.lotus.user.dto.response.AuthResponse;
import com.desafio.lotus.user.dto.response.MessageResponse;
import com.desafio.lotus.user.dto.response.UserResponse;
import com.desafio.lotus.exception.EmailAlreadyExistsException;
import com.desafio.lotus.exception.InvalidCredentialsException;
import com.desafio.lotus.user.model.User;
import com.desafio.lotus.user.repository.UserRepository;
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
            .orElseThrow(() -> new InvalidCredentialsException("Credenciais invalidas"));

        boolean passwordMatches = passwordEncoder.matches(request.password(), user.getPassword());
        if (!passwordMatches) {
            throw new InvalidCredentialsException("Credenciais invalidas");
        }

        String token = jwtUtil.generateToken(user);
        UserResponse userResponse = toUserResponse(user);
        return new AuthResponse(token, userResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse me(User authenticatedUser) {
        return toUserResponse(authenticatedUser);
    }

    public MessageResponse logout(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new InvalidCredentialsException("Token inválido");
        }

        String token = authorizationHeader.substring(7).trim();
        if (token.isBlank()) {
            throw new InvalidCredentialsException("Token inválido");
        }

        jwtUtil.revokeToken(token);
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

