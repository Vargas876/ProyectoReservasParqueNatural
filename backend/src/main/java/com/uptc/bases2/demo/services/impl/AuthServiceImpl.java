package com.uptc.bases2.demo.services.impl;

import com.uptc.bases2.demo.exceptions.BadRequestException;
import com.uptc.bases2.demo.exceptions.ConflictException;
import com.uptc.bases2.demo.exceptions.ResourceNotFoundException;
import com.uptc.bases2.demo.exceptions.UnauthorizedException;
import com.uptc.bases2.demo.models.dto.request.AuthRequestDTO;
import com.uptc.bases2.demo.models.dto.request.GuiaRequestDTO;
import com.uptc.bases2.demo.models.dto.request.VisitanteRequestDTO;
import com.uptc.bases2.demo.models.dto.response.AuthResponseDTO;
import com.uptc.bases2.demo.models.entities.Guia;
import com.uptc.bases2.demo.models.entities.Usuario;
import com.uptc.bases2.demo.models.entities.Visitante;
import com.uptc.bases2.demo.models.enums.Rol;
import com.uptc.bases2.demo.repositories.GuiaRepository;
import com.uptc.bases2.demo.repositories.UsuarioRepository;
import com.uptc.bases2.demo.repositories.VisitanteRepository;
import com.uptc.bases2.demo.security.JwtTokenProvider;
import com.uptc.bases2.demo.services.interfaces.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del servicio de autenticación
 */
@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VisitanteRepository visitanteRepository;

    @Autowired
    private GuiaRepository guiaRepository;

    @Override
    public AuthResponseDTO login(AuthRequestDTO request) {
        try {
            // Autenticar usuario
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );

            // Establecer autenticación en el contexto
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generar token JWT
            String token = tokenProvider.generateToken(authentication);

            // Obtener usuario autenticado
            Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

            // Construir respuesta
            return new AuthResponseDTO(
                token,
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRol().name()
            );

        } catch (Exception e) {
            throw new UnauthorizedException("Email o contraseña incorrectos");
        }
    }

    @Override
    public AuthResponseDTO registrarVisitante(VisitanteRequestDTO request) {
        // Validar que no exista el email
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("El email ya está registrado");
        }

        // Validar que no exista la cédula
        if (usuarioRepository.existsByCedula(request.getCedula())) {
            throw new ConflictException("La cédula ya está registrada");
        }

        // Crear nuevo visitante
        Visitante visitante = new Visitante(
            request.getCedula(),
            request.getNombre(),
            request.getApellido(),
            request.getTelefono(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword())
        );

        // Guardar visitante
        visitante = visitanteRepository.save(visitante);

        // Autenticar automáticamente
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        String token = tokenProvider.generateToken(authentication);

        return new AuthResponseDTO(
            token,
            visitante.getId(),
            visitante.getNombre(),
            visitante.getApellido(),
            visitante.getEmail(),
            visitante.getRol().name()
        );
    }

    @Override
    public AuthResponseDTO registrarGuia(GuiaRequestDTO request) {
        // Validar que no exista el email
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("El email ya está registrado");
        }

        // Validar que no exista la cédula
        if (usuarioRepository.existsByCedula(request.getCedula())) {
            throw new ConflictException("La cédula ya está registrada");
        }

        // Crear nuevo guía
        Guia guia = new Guia(
            request.getCedula(),
            request.getNombre(),
            request.getApellido(),
            request.getTelefono(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getEspecialidades()
        );

        if (request.getMaxPersonasGrupo() != null) {
            guia.setMaxPersonasGrupo(request.getMaxPersonasGrupo());
        }

        // Guardar guía
        guia = guiaRepository.save(guia);

        // Autenticar automáticamente
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        String token = tokenProvider.generateToken(authentication);

        return new AuthResponseDTO(
            token,
            guia.getId(),
            guia.getNombre(),
            guia.getApellido(),
            guia.getEmail(),
            guia.getRol().name()
        );
    }

    @Override
    public void cambiarPassword(Long usuarioId, String passwordActual, String passwordNueva) {
        // Buscar usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", usuarioId));

        // Verificar password actual
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new BadRequestException("La contraseña actual es incorrecta");
        }

        // Actualizar password
        usuario.setPassword(passwordEncoder.encode(passwordNueva));
        usuarioRepository.save(usuario);
    }
}
