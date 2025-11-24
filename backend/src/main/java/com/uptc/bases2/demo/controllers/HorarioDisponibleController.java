package com.uptc.bases2.demo.controllers;

import com.uptc.bases2.demo.models.dto.request.HorarioRequestDTO;
import com.uptc.bases2.demo.models.dto.response.ApiResponseDTO;
import com.uptc.bases2.demo.models.dto.response.HorarioResponseDTO;
import com.uptc.bases2.demo.services.interfaces.HorarioDisponibleService;
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
 * Controlador para gestión de horarios disponibles
 */
@RestController
@RequestMapping("/horarios")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Horarios", description = "Gestión de horarios disponibles por sendero")
public class HorarioDisponibleController {

    @Autowired
    private HorarioDisponibleService horarioService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear nuevo horario", 
               description = "Crea un horario validando que no haya solapamiento")
    public ResponseEntity<HorarioResponseDTO> crear(@Valid @RequestBody HorarioRequestDTO request) {
        HorarioResponseDTO horario = horarioService.crear(request);
        return new ResponseEntity<>(horario, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtener horario por ID")
    public ResponseEntity<HorarioResponseDTO> obtenerPorId(@PathVariable Long id) {
        HorarioResponseDTO horario = horarioService.obtenerPorId(id);
        return ResponseEntity.ok(horario);
    }

    @GetMapping("/sendero/{senderoId}")
    @Operation(summary = "Obtener horarios de un sendero (público)")
    public ResponseEntity<List<HorarioResponseDTO>> obtenerPorSendero(@PathVariable Long senderoId) {
        List<HorarioResponseDTO> horarios = horarioService.obtenerPorSendero(senderoId);
        return ResponseEntity.ok(horarios);
    }

    @GetMapping("/sendero/{senderoId}/activos")
    @Operation(summary = "Obtener horarios activos de un sendero")
    public ResponseEntity<List<HorarioResponseDTO>> obtenerActivosPorSendero(@PathVariable Long senderoId) {
        List<HorarioResponseDTO> horarios = horarioService.obtenerActivosPorSendero(senderoId);
        return ResponseEntity.ok(horarios);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar horario")
    public ResponseEntity<HorarioResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody HorarioRequestDTO request) {
        
        HorarioResponseDTO horario = horarioService.actualizar(id, request);
        return ResponseEntity.ok(horario);
    }

    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activar horario")
    public ResponseEntity<ApiResponseDTO<Void>> activar(@PathVariable Long id) {
        horarioService.activar(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Horario activado exitosamente"));
    }

    @PatchMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Desactivar horario")
    public ResponseEntity<ApiResponseDTO<Void>> desactivar(@PathVariable Long id) {
        horarioService.desactivar(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Horario desactivado exitosamente"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar horario (lógico)")
    public ResponseEntity<ApiResponseDTO<Void>> eliminar(@PathVariable Long id) {
        horarioService.eliminar(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Horario eliminado exitosamente"));
    }
}
