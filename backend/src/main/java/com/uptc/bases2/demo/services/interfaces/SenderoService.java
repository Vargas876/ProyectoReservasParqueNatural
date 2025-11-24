package com.uptc.bases2.demo.services.interfaces;

import com.uptc.bases2.demo.models.dto.request.SenderoRequestDTO;
import com.uptc.bases2.demo.models.dto.response.SenderoResponseDTO;

import java.time.LocalDate;
import java.util.List;

/**
 * Interface para servicios de senderos
 */
public interface SenderoService {
    
    SenderoResponseDTO crear(SenderoRequestDTO request);
    
    SenderoResponseDTO obtenerPorId(Long id);
    
    List<SenderoResponseDTO> obtenerTodos();
    
    List<SenderoResponseDTO> obtenerActivos();
    
    List<SenderoResponseDTO> obtenerDisponibles(LocalDate fecha);
    
    SenderoResponseDTO actualizar(Long id, SenderoRequestDTO request);
    
    void cambiarEstado(Long id, String nuevoEstado);
    
    void eliminar(Long id);
    
    Integer calcularCupoDisponible(Long senderoId, LocalDate fecha);
}
