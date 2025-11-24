package com.uptc.bases2.demo.services.interfaces;

import com.uptc.bases2.demo.models.dto.request.VisitanteRequestDTO;
import com.uptc.bases2.demo.models.dto.response.VisitanteResponseDTO;

import java.util.List;

/**
 * Interface para servicios de visitantes
 */
public interface VisitanteService {
    
    VisitanteResponseDTO obtenerPorId(Long id);
    
    VisitanteResponseDTO obtenerPorEmail(String email);
    
    List<VisitanteResponseDTO> obtenerTodos();
    
    List<VisitanteResponseDTO> obtenerActivos();
    
    VisitanteResponseDTO actualizar(Long id, VisitanteRequestDTO request);
    
    void cambiarEstado(Long id, String nuevoEstado);
    
    void eliminar(Long id);
    
    boolean puedeHacerReserva(Long visitanteId);
}
