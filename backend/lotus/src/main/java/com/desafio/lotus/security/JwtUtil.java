package com.desafio.lotus.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.desafio.lotus.model.User;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

	private final Algorithm algorithm;
	private final long expirationMs;

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
			return true;
		} catch (JWTVerificationException ex) {
			return false;
		}
	}

	public UUID getSubject(String token) {
		DecodedJWT decodedJWT = JWT.require(algorithm).build().verify(token);
		return UUID.fromString(decodedJWT.getSubject());
	}
}
