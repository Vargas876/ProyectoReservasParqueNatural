package com.uptc.bases2.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8081");
        devServer.setDescription("Servidor de Desarrollo");

        Contact contact = new Contact();
        contact.setEmail("admin@parque.com");
        contact.setName("Administración Parque Natural");

        License license = new License()
            .name("MIT License")
            .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
            .title("API - Sistema de Gestión de Reservas Parque Natural")
            .version("1.0.0")
            .contact(contact)
            .description("API RESTful para la gestión de reservas de senderos en el parque natural. " +
                        "Incluye gestión de visitantes, senderos, guías y asignaciones.")
            .license(license);

        return new OpenAPI()
            .info(info)
            .servers(List.of(devServer));
    }
}

