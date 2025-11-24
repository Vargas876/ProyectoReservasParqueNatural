package com.uptc.bases2.demo.services.interfaces;

import com.uptc.bases2.demo.models.dto.request.ReservaRequestDTO;
import com.uptc.bases2.demo.models.dto.request.ReservaUpdateDTO;
import com.uptc.bases2.demo.models.dto.response.ReservaResponseDTO;

import java.time.LocalDate;
import java.util.List;

/**
 * Interface para servicios de reservas
 */
public interface ReservaService {
    
    ReservaResponseDTO crear(Long visitanteId, ReservaRequestDTO request);
    
    ReservaResponseDTO obtenerPorId(Long id);
    
    List<ReservaResponseDTO> obtenerPorVisitante(Long visitanteId);
    
    List<ReservaResponseDTO> obtenerReservasActivas(Long visitanteId);
    
    List<ReservaResponseDTO> obtenerPorSendero(Long senderoId);
    
    List<ReservaResponseDTO> obtenerPorFecha(LocalDate fecha);
    
    List<ReservaResponseDTO> obtenerTodas();
    
    ReservaResponseDTO modificar(Long reservaId, ReservaUpdateDTO request);
    
    void cancelar(Long reservaId, String motivo);
    
    void confirmar(Long reservaId);
    
    void completar(Long reservaId);
    
    void marcarNoAsistio(Long reservaId);
}
