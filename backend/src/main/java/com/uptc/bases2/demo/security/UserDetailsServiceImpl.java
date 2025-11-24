package com.uptc.bases2.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uptc.bases2.demo.models.entities.Usuario;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import com.uptc.bases2.demo.repositories.UsuarioRepository;

/**
 * Implementación de UserDetailsService de Spring Security
 * Carga los detalles del usuario desde la base de datos
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Buscar usuario por email
        Usuario usuario = usuarioRepository.findByEmailAndEstado(email, EstadoGeneral.ACTIVO)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        // Convertir entidad Usuario a UserDetails
        return UserDetailsImpl.build(usuario);
    }

    /**
     * Carga usuario por ID (útil para algunas operaciones)
     */
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByIdAndEstado(id, EstadoGeneral.ACTIVO)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con ID: " + id));

        return UserDetailsImpl.build(usuario);
    }
}
