package com.uptc.bases2.demo.services.interfaces;

import com.uptc.bases2.demo.models.dto.request.AuthRequestDTO;
import com.uptc.bases2.demo.models.dto.request.GuiaRequestDTO;
import com.uptc.bases2.demo.models.dto.request.VisitanteRequestDTO;
import com.uptc.bases2.demo.models.dto.response.AuthResponseDTO;

/**
 * Interface para servicios de autenticación y registro
 */
public interface AuthService {
    
    AuthResponseDTO login(AuthRequestDTO request);
    
    AuthResponseDTO registrarVisitante(VisitanteRequestDTO request);
    
    AuthResponseDTO registrarGuia(GuiaRequestDTO request);
    
    void cambiarPassword(Long usuarioId, String passwordActual, String passwordNueva);
}
