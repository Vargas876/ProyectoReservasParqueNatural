package com.uptc.bases2.demo.services.interfaces;

import com.uptc.bases2.demo.models.dto.request.AsignacionGuiaRequestDTO;
import com.uptc.bases2.demo.models.dto.request.FinalizarRecorridoDTO;
import com.uptc.bases2.demo.models.dto.request.IniciarRecorridoDTO;
import com.uptc.bases2.demo.models.dto.response.AsignacionResponseDTO;

import java.util.List;

/**
 * Interface para servicios de asignación de guías
 */
public interface AsignacionGuiaService {
    
    AsignacionResponseDTO asignarGuia(AsignacionGuiaRequestDTO request);
    
    AsignacionResponseDTO obtenerPorId(Long id);
    
    AsignacionResponseDTO obtenerPorReserva(Long reservaId);
    
    List<AsignacionResponseDTO> obtenerPorGuia(Long guiaId);
    
    void iniciarRecorrido(IniciarRecorridoDTO request);
    
    void finalizarRecorrido(FinalizarRecorridoDTO request);
    
    void reasignarGuia(Long asignacionId, Long nuevoGuiaId);
    
    List<AsignacionResponseDTO> obtenerAsignacionesActivas();
}
