package com.desafio.lotus.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {

    @Bean
    public OpenAPI lotusOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Lotus API")
                        .description("API de gerenciamento de usuarios, projetos e tarefas")
                        .version("v1")
                        .contact(new Contact()
                                .name("Lotus Team")
                                .email("dev@lotus.local"))
                        .license(new License().name("MIT")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .schemaRequirement(
                        "bearerAuth",
                        new io.swagger.v3.oas.models.security.SecurityScheme()
                                .type(Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                );
    }
}
