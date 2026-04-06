package com.desafio.lotus.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskStatus {
    PENDING,
    IN_PROGRESS,
    DONE;

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static TaskStatus fromValue(String value) {
        return TaskStatus.valueOf(value.toUpperCase());
    }
}
