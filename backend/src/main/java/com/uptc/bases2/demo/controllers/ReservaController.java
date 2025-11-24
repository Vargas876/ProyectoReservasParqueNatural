package com.uptc.bases2.demo.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.bases2.demo.models.dto.request.ReservaRequestDTO;
import com.uptc.bases2.demo.models.dto.request.ReservaUpdateDTO;
import com.uptc.bases2.demo.models.dto.response.ApiResponseDTO;
import com.uptc.bases2.demo.models.dto.response.ReservaResponseDTO;
import com.uptc.bases2.demo.services.interfaces.ReservaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador para gestión de reservas
 */
@RestController
@RequestMapping("/reservas")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Reservas", description = "Gestión de reservas de visitantes")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping("/visitante/{visitanteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITANTE')")
    @Operation(summary = "Crear nueva reserva", description = "Crea una reserva validando todas las reglas de negocio")
    public ResponseEntity<ReservaResponseDTO> crear(
            @PathVariable Long visitanteId,
            @Valid @RequestBody ReservaRequestDTO request) {

        ReservaResponseDTO reserva = reservaService.crear(visitanteId, request);
        return new ResponseEntity<>(reserva, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITANTE', 'GUIA')")
    @Operation(summary = "Obtener reserva por ID")
    public ResponseEntity<ReservaResponseDTO> obtenerPorId(@PathVariable Long id) {
        ReservaResponseDTO reserva = reservaService.obtenerPorId(id);
        return ResponseEntity.ok(reserva);
    }

    @GetMapping("/visitante/{visitanteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITANTE')")
    @Operation(summary = "Obtener todas las reservas de un visitante")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerPorVisitante(@PathVariable Long visitanteId) {
        List<ReservaResponseDTO> reservas = reservaService.obtenerPorVisitante(visitanteId);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/visitante/{visitanteId}/activas")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITANTE')")
    @Operation(summary = "Obtener reservas activas de un visitante")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerReservasActivas(@PathVariable Long visitanteId) {
        List<ReservaResponseDTO> reservas = reservaService.obtenerReservasActivas(visitanteId);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/sendero/{senderoId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtener reservas de un sendero")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerPorSendero(@PathVariable Long senderoId) {
        List<ReservaResponseDTO> reservas = reservaService.obtenerPorSendero(senderoId);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/fecha")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIA')")
    @Operation(summary = "Obtener reservas por fecha")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        List<ReservaResponseDTO> reservas = reservaService.obtenerPorFecha(fecha);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas las reservas")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerTodas() {
        List<ReservaResponseDTO> reservas = reservaService.obtenerTodas();
        return ResponseEntity.ok(reservas);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITANTE')")
    @Operation(summary = "Modificar reserva", description = "Modifica una reserva validando reglas de negocio")
    public ResponseEntity<ReservaResponseDTO> modificar(
            @PathVariable Long id,
            @Valid @RequestBody ReservaUpdateDTO request) {

        ReservaResponseDTO reserva = reservaService.modificar(id, request);
        return ResponseEntity.ok(reserva);
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_VISITANTE')")
    @Operation(summary = "Cancelar reserva")
    public ResponseEntity<ApiResponseDTO<Void>> cancelar(
            @PathVariable Long id,
            @RequestParam String motivo) {

        reservaService.cancelar(id, motivo);
        return ResponseEntity.ok(ApiResponseDTO.success("Reserva cancelada exitosamente"));
    }

    @PatchMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Confirmar reserva")
    public ResponseEntity<ApiResponseDTO<Void>> confirmar(@PathVariable Long id) {
        reservaService.confirmar(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Reserva confirmada exitosamente"));
    }

    @PatchMapping("/{id}/completar")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIA')")
    @Operation(summary = "Marcar reserva como completada")
    public ResponseEntity<ApiResponseDTO<Void>> completar(@PathVariable Long id) {
        reservaService.completar(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Reserva completada exitosamente"));
    }

    @PatchMapping("/{id}/no-asistio")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIA')")
    @Operation(summary = "Marcar como 'No Asistió'")
    public ResponseEntity<ApiResponseDTO<Void>> marcarNoAsistio(@PathVariable Long id) {
        reservaService.marcarNoAsistio(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Reserva marcada como 'No Asistió'"));
    }
}
