package com.uptc.bases2.demo.services.interfaces;

import com.uptc.bases2.demo.models.dto.request.GuiaRequestDTO;
import com.uptc.bases2.demo.models.dto.response.AgendaGuiaResponseDTO;
import com.uptc.bases2.demo.models.dto.response.GuiaResponseDTO;

import java.time.LocalDate;
import java.util.List;

/**
 * Interface para servicios de guías
 */
public interface GuiaService {
    
    GuiaResponseDTO crear(GuiaRequestDTO request);
    
    GuiaResponseDTO obtenerPorId(Long id);
    
    GuiaResponseDTO obtenerPorEmail(String email);
    
    List<GuiaResponseDTO> obtenerTodos();
    
    List<GuiaResponseDTO> obtenerActivos();
    
    List<GuiaResponseDTO> obtenerDisponiblesPorFecha(LocalDate fecha);
    
    GuiaResponseDTO actualizar(Long id, GuiaRequestDTO request);
    
    void cambiarEstado(Long id, String nuevoEstado);
    
    void eliminar(Long id);
    
    AgendaGuiaResponseDTO obtenerAgenda(Long guiaId, LocalDate fecha);
    
    boolean puedeTomarRecorrido(Long guiaId, LocalDate fecha);
}
