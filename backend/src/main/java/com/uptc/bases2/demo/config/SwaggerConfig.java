package com.uptc.bases2.demo.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${server.port:8081}")
    private String serverPort;

    @Value("${server.servlet.context-path:/api}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        Server localServer = new Server()
            .url("http://localhost:" + serverPort + contextPath)
            .description("Servidor de Desarrollo");

        Contact contact = new Contact()
            .name("Equipo Desarrollo - UPTC")
            .email("sistemas@uptc.edu.co");

        License license = new License()
            .name("Apache 2.0")
            .url("https://www.apache.org/licenses/LICENSE-2.0.html");

        Info info = new Info()
            .title("API Sistema de Reservas - Parque Natural")
            .version("1.0.0")
            .description(
                "**API RESTful para gestión de reservas en parque natural**\n\n" +
                "### Características:\n" +
                "- Autenticación JWT\n" +
                "- 3 roles: ADMIN, GUIA, VISITANTE\n" +
                "- Validación de reglas de negocio\n" +
                "- Gestión completa de reservas, senderos y guías\n\n" +
                "### Autenticación:\n" +
                "1. Obtén un token en `/auth/login`\n" +
                "2. Usa el botón 'Authorize' arriba\n" +
                "3. Ingresa: `Bearer <tu_token>`"
            )
            .contact(contact)
            .license(license);

        String securitySchemeName = "Bearer Authentication";
        SecurityScheme securityScheme = new SecurityScheme()
            .name(securitySchemeName)
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .in(SecurityScheme.In.HEADER)
            .description("JWT token obtenido del endpoint /auth/login");

        SecurityRequirement securityRequirement = new SecurityRequirement()
            .addList(securitySchemeName);

        return new OpenAPI()
            .info(info)
            .servers(List.of(localServer))
            .addSecurityItem(securityRequirement)
            .components(new Components().addSecuritySchemes(securitySchemeName, securityScheme));
    }
}
