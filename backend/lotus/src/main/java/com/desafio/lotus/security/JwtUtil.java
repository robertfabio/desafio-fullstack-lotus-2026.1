package com.desafio.lotus.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.desafio.lotus.user.model.User;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

	private final Algorithm algorithm;
	private final long expirationMs;
	private final Map<String, Long> revokedTokens = new ConcurrentHashMap<>();

	public JwtUtil(
			@Value("${app.jwt.secret}") String secret,
			@Value("${app.jwt.expiration}") long expirationMs
	) {
		this.algorithm = Algorithm.HMAC256(secret);
		this.expirationMs = expirationMs;
	}

	public String generateToken(User user) {
		Instant now = Instant.now();
		Instant expiresAt = now.plusMillis(expirationMs);

		return JWT.create()
				.withSubject(user.getId().toString())
				.withClaim("email", user.getEmail())
				.withClaim("name", user.getName())
				.withIssuedAt(Date.from(now))
				.withExpiresAt(Date.from(expiresAt))
				.sign(algorithm);
	}

	public boolean validateToken(String token) {
		try {
			JWT.require(algorithm).build().verify(token);
			return !isTokenRevoked(token);
		} catch (JWTVerificationException ex) {
			return false;
		}
	}

	public void revokeToken(String token) {
		try {
			DecodedJWT decodedJWT = JWT.require(algorithm).build().verify(token);
			revokedTokens.put(token, decodedJWT.getExpiresAt().toInstant().toEpochMilli());
		} catch (JWTVerificationException ex) {
			throw new IllegalArgumentException("Token invalido");
		}
	}

	private boolean isTokenRevoked(String token) {
		cleanupExpiredRevocations();
		Long expiresAt = revokedTokens.get(token);
		return expiresAt != null && expiresAt > Instant.now().toEpochMilli();
	}

	private void cleanupExpiredRevocations() {
		long now = Instant.now().toEpochMilli();
		revokedTokens.entrySet().removeIf(entry -> entry.getValue() <= now);
	}

	public UUID getSubject(String token) {
		DecodedJWT decodedJWT = JWT.require(algorithm).build().verify(token);
		return UUID.fromString(decodedJWT.getSubject());
	}
}

