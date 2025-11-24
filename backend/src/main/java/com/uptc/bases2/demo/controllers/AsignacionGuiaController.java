package com.uptc.bases2.demo.controllers;

import com.uptc.bases2.demo.models.dto.request.AsignacionGuiaRequestDTO;
import com.uptc.bases2.demo.models.dto.request.FinalizarRecorridoDTO;
import com.uptc.bases2.demo.models.dto.request.IniciarRecorridoDTO;
import com.uptc.bases2.demo.models.dto.response.ApiResponseDTO;
import com.uptc.bases2.demo.models.dto.response.AsignacionResponseDTO;
import com.uptc.bases2.demo.services.interfaces.AsignacionGuiaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para asignación de guías a reservas
 */
@RestController
@RequestMapping("/asignaciones")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Asignaciones", description = "Gestión de asignación de guías a reservas")
public class AsignacionGuiaController {

    @Autowired
    private AsignacionGuiaService asignacionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Asignar guía a reserva", 
               description = "Asigna un guía validando disponibilidad y capacidad")
    public ResponseEntity<AsignacionResponseDTO> asignarGuia(@Valid @RequestBody AsignacionGuiaRequestDTO request) {
        AsignacionResponseDTO asignacion = asignacionService.asignarGuia(request);
        return new ResponseEntity<>(asignacion, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIA')")
    @Operation(summary = "Obtener asignación por ID")
    public ResponseEntity<AsignacionResponseDTO> obtenerPorId(@PathVariable Long id) {
        AsignacionResponseDTO asignacion = asignacionService.obtenerPorId(id);
        return ResponseEntity.ok(asignacion);
    }

    @GetMapping("/reserva/{reservaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIA', 'VISITANTE')")
    @Operation(summary = "Obtener asignación por reserva")
    public ResponseEntity<AsignacionResponseDTO> obtenerPorReserva(@PathVariable Long reservaId) {
        AsignacionResponseDTO asignacion = asignacionService.obtenerPorReserva(reservaId);
        return ResponseEntity.ok(asignacion);
    }

    @GetMapping("/guia/{guiaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIA')")
    @Operation(summary = "Obtener asignaciones de un guía")
    public ResponseEntity<List<AsignacionResponseDTO>> obtenerPorGuia(@PathVariable Long guiaId) {
        List<AsignacionResponseDTO> asignaciones = asignacionService.obtenerPorGuia(guiaId);
        return ResponseEntity.ok(asignaciones);
    }

    @GetMapping("/activas")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIA')")
    @Operation(summary = "Listar asignaciones activas")
    public ResponseEntity<List<AsignacionResponseDTO>> obtenerActivas() {
        List<AsignacionResponseDTO> asignaciones = asignacionService.obtenerAsignacionesActivas();
        return ResponseEntity.ok(asignaciones);
    }

    @PostMapping("/iniciar")
    @PreAuthorize("hasRole('GUIA')")
    @Operation(summary = "Iniciar recorrido", 
               description = "El guía marca el inicio del recorrido")
    public ResponseEntity<ApiResponseDTO<Void>> iniciarRecorrido(@Valid @RequestBody IniciarRecorridoDTO request) {
        asignacionService.iniciarRecorrido(request);
        return ResponseEntity.ok(ApiResponseDTO.success("Recorrido iniciado exitosamente"));
    }

    @PostMapping("/finalizar")
    @PreAuthorize("hasRole('GUIA')")
    @Operation(summary = "Finalizar recorrido", 
               description = "El guía marca el fin del recorrido y registra observaciones")
    public ResponseEntity<ApiResponseDTO<Void>> finalizarRecorrido(@Valid @RequestBody FinalizarRecorridoDTO request) {
        asignacionService.finalizarRecorrido(request);
        return ResponseEntity.ok(ApiResponseDTO.success("Recorrido finalizado exitosamente"));
    }

    @PatchMapping("/{id}/reasignar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reasignar guía", 
               description = "Cambia el guía asignado a una reserva")
    public ResponseEntity<ApiResponseDTO<Void>> reasignarGuia(
            @PathVariable Long id,
            @RequestParam Long nuevoGuiaId) {
        
        asignacionService.reasignarGuia(id, nuevoGuiaId);
        return ResponseEntity.ok(ApiResponseDTO.success("Guía reasignado exitosamente"));
    }
}
