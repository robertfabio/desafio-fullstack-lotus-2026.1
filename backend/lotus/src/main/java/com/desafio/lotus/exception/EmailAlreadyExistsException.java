package com.desafio.lotus.exception;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String email) {
        super("Email já existe: " + email);
    }
}
