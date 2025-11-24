package com.uptc.bases2.demo.services.interfaces;

import com.uptc.bases2.demo.models.dto.request.HorarioRequestDTO;
import com.uptc.bases2.demo.models.dto.response.HorarioResponseDTO;

import java.util.List;

/**
 * Interface para servicios de horarios disponibles
 */
public interface HorarioDisponibleService {
    
    HorarioResponseDTO crear(HorarioRequestDTO request);
    
    HorarioResponseDTO obtenerPorId(Long id);
    
    List<HorarioResponseDTO> obtenerPorSendero(Long senderoId);
    
    List<HorarioResponseDTO> obtenerActivosPorSendero(Long senderoId);
    
    HorarioResponseDTO actualizar(Long id, HorarioRequestDTO request);
    
    void activar(Long id);
    
    void desactivar(Long id);
    
    void eliminar(Long id);
}
