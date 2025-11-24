package com.uptc.bases2.demo.services.impl;

import com.uptc.bases2.demo.exceptions.ConflictException;
import com.uptc.bases2.demo.exceptions.ResourceNotFoundException;
import com.uptc.bases2.demo.models.dto.request.VisitanteRequestDTO;
import com.uptc.bases2.demo.models.dto.response.VisitanteResponseDTO;
import com.uptc.bases2.demo.models.entities.Visitante;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import com.uptc.bases2.demo.repositories.VisitanteRepository;
import com.uptc.bases2.demo.services.interfaces.VisitanteService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de visitantes
 */
@Service
@Transactional
public class VisitanteServiceImpl implements VisitanteService {

    @Autowired
    private VisitanteRepository visitanteRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public VisitanteResponseDTO obtenerPorId(Long id) {
        Visitante visitante = visitanteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Visitante", "id", id));
        
        return modelMapper.map(visitante, VisitanteResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public VisitanteResponseDTO obtenerPorEmail(String email) {
        Visitante visitante = visitanteRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Visitante", "email", email));
        
        return modelMapper.map(visitante, VisitanteResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitanteResponseDTO> obtenerTodos() {
        return visitanteRepository.findAll().stream()
            .map(visitante -> modelMapper.map(visitante, VisitanteResponseDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitanteResponseDTO> obtenerActivos() {
        return visitanteRepository.findAllActivos().stream()
            .map(visitante -> modelMapper.map(visitante, VisitanteResponseDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    public VisitanteResponseDTO actualizar(Long id, VisitanteRequestDTO request) {
        Visitante visitante = visitanteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Visitante", "id", id));

        // Validar email único (excluyendo el visitante actual)
        if (visitanteRepository.findByEmail(request.getEmail()).isPresent()) {
            Visitante existente = visitanteRepository.findByEmail(request.getEmail()).get();
            if (!existente.getId().equals(id)) {
                throw new ConflictException("El email ya está en uso");
            }
        }

        // Actualizar datos
        visitante.setNombre(request.getNombre());
        visitante.setApellido(request.getApellido());
        visitante.setTelefono(request.getTelefono());
        visitante.setEmail(request.getEmail());

        // Solo actualizar contraseña si se proporcionó una nueva
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            visitante.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        visitante = visitanteRepository.save(visitante);
        return modelMapper.map(visitante, VisitanteResponseDTO.class);
    }

    @Override
    public void cambiarEstado(Long id, String nuevoEstado) {
        Visitante visitante = visitanteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Visitante", "id", id));

        visitante.setEstado(EstadoGeneral.fromString(nuevoEstado));
        visitanteRepository.save(visitante);
    }

    @Override
    public void eliminar(Long id) {
        Visitante visitante = visitanteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Visitante", "id", id));

        // Eliminación lógica
        visitante.setEstado(EstadoGeneral.ELIMINADO);
        visitanteRepository.save(visitante);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean puedeHacerReserva(Long visitanteId) {
        return visitanteRepository.puedeHacerReserva(visitanteId);
    }
}
