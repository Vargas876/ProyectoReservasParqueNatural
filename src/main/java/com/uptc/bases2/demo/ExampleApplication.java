package com.uptc.bases2.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.uptc.bases2.demo")
@EntityScan("com.uptc.bases2.demo.models")
@EnableJpaRepositories("com.uptc.bases2.demo.repository")
public class ExampleApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExampleApplication.class, args);
        System.out.println("=========================================");
        System.out.println("Sistema de Reservas - Parque Natural");
        System.out.println("Servidor iniciado en: http://localhost:8081/");
        System.out.println("=========================================");
    }

}
