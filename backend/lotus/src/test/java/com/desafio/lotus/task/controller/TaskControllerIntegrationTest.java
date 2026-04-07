package com.desafio.lotus.task.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.desafio.lotus.task.dto.response.TaskResponse;
import com.desafio.lotus.task.model.TaskPriority;
import com.desafio.lotus.task.model.TaskStatus;
import com.desafio.lotus.task.service.TaskService;
import com.desafio.lotus.user.model.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Test
    void findAllShouldReturnBadRequestForInvalidStatusFilter() throws Exception {
        User principal = User.builder().id(UUID.randomUUID()).build();

        mockMvc.perform(get("/tasks")
                                                .principal(new UsernamePasswordAuthenticationToken(principal, null))
                        .param("status", "invalid-status"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Falha na validação"));
    }

    @Test
    void findAllShouldReturnOkWhenFiltersAreValid() throws Exception {
        User principal = User.builder().id(UUID.randomUUID()).build();

        TaskResponse response = new TaskResponse(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "Task name",
                "Task description",
                TaskStatus.PENDING,
                TaskPriority.MEDIUM,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(taskService.findAll(any(User.class), any(TaskStatus.class), isNull(), isNull(), isNull()))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/tasks")
                        .principal(new UsernamePasswordAuthenticationToken(principal, null))
                        .param("status", "pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Task name"))
                .andExpect(jsonPath("$[0].status").value("pending"));
    }
}
