package com.desafio.lotus.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskPriority {
    LOW,
    MEDIUM,
    HIGH;

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static TaskPriority fromValue(String value) {
        return TaskPriority.valueOf(value.toUpperCase());
    }
}
