package com.uptc.bases2.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.uptc.bases2.demo.security.JwtAuthenticationEntryPoint;
import com.uptc.bases2.demo.security.JwtAuthenticationFilter;
import com.uptc.bases2.demo.security.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private CorsConfig corsConfig;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
            throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))

                // Manejo de excepciones de autenticación
                .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))

                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers(
                                "/auth/**",
                                "/senderos/publicos/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html")
                        .permitAll()

                        // Endpoints para ADMIN
                        .requestMatchers(
                                "/senderos/crear",
                                "/senderos/*/actualizar",
                                "/senderos/*/eliminar",
                                "/guias/crear",
                                "/guias/*/actualizar",
                                "/horarios/**",
                                "/reportes/**",
                                "/asignaciones/asignar/**")
                        .hasRole("ADMIN")

                        // Endpoints para GUIA
                        .requestMatchers(
                                "/guias/mi-agenda",
                                "/asignaciones/iniciar/**",
                                "/asignaciones/finalizar/**",
                                "/asignaciones/mis-asignaciones")
                        .hasRole("GUIA")

                        // Endpoints para VISITANTE
                        .requestMatchers(
                                "/reservas/mis-reservas",
                                "/reservas/crear",
                                "/reservas/*/modificar",
                                // "/reservas/*/cancelar" - Removido: ahora se controla con @PreAuthorize para
                                // permitir ADMIN y VISITANTE
                                "/visitantes/mi-perfil")
                        .hasRole("VISITANTE")

                        // Cualquier otro endpoint requiere autenticación
                        .anyRequest().authenticated())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
