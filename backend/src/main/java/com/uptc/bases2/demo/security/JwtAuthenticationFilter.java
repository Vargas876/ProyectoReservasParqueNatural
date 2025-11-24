package com.uptc.bases2.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que intercepta cada request para validar el token JWT
 * Se ejecuta una sola vez por petición
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Extraer token del header Authorization
            String jwt = getJwtFromRequest(request);
            
            // Validar token
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                
                // Extraer email del token
                String email = tokenProvider.getEmailFromToken(jwt);
                
                // Cargar detalles del usuario
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                
                // Crear objeto de autenticación
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                
                // Agregar detalles del request
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                // Establecer autenticación en el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                logger.debug("Usuario autenticado: {} con roles: {}", 
                    email, userDetails.getAuthorities());
            }
            
        } catch (Exception ex) {
            logger.error("No se pudo establecer autenticación: {}", ex.getMessage());
        }
        
        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    /**
     * Extrae el token JWT del header Authorization
     * Formato esperado: "Bearer <token>"
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remover "Bearer " (7 caracteres)
        }
        
        return null;
    }
}
