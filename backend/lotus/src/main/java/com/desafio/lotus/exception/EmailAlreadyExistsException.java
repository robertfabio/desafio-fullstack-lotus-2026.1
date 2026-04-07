package com.desafio.lotus.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends BusinessException {

    public EmailAlreadyExistsException(String email) {
        super(HttpStatus.CONFLICT, "Email já existe: " + email);
    }
}
