package com.uptc.bases2.demo.controllers;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.bases2.demo.models.AsignacionGuia;
import com.uptc.bases2.demo.services.AsignacionGuiaService;

@RestController
@RequestMapping("/asignacion")
public class AsignacionGuiaController {

    @Autowired
    private AsignacionGuiaService asignacionService;
    
    @GetMapping("/findAll")
    public List<AsignacionGuia> getAllAsignaciones() {
        return asignacionService.findAll();
    }

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> createAsignacion(@RequestBody AsignacionGuia asignacion) {
        try {
            AsignacionGuia nuevaAsignacion = asignacionService.save(asignacion);
            
            Map<String, Object> response = new HashMap<>();
            response.put("idAsignacion", nuevaAsignacion.getIdAsignacion());
            response.put("idReserva", nuevaAsignacion.getReserva().getIdReserva());
            response.put("idGuia", nuevaAsignacion.getGuia().getIdGuia());
            response.put("nombreGuia", nuevaAsignacion.getGuia().getNombre() + " " + nuevaAsignacion.getGuia().getApellido());
            response.put("fechaAsignacion", nuevaAsignacion.getFechaAsignacion());
            response.put("mensaje", "Guía asignado exitosamente. Notificación enviada.");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No se pudo asignar el guía");
            error.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<AsignacionGuia> getAsignacionById(@PathVariable Long id) {
        return asignacionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByReserva/{idReserva}")
    public ResponseEntity<AsignacionGuia> getAsignacionByReserva(@PathVariable Long idReserva) {
        return asignacionService.findByReservaId(idReserva)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByGuia/{idGuia}")
    public List<AsignacionGuia> getAsignacionesByGuia(@PathVariable Long idGuia) {
        return asignacionService.findByGuiaId(idGuia);
    }
    
    @GetMapping("/findByFecha")
    public List<AsignacionGuia> getAsignacionesByFecha(@RequestParam String fecha) {
        try {
            LocalDate fechaConsulta = LocalDate.parse(fecha);
            return asignacionService.findByFecha(fechaConsulta);
        } catch (Exception e) {
            return List.of();
        }
    }
    
    @GetMapping("/findByGuiaAndFecha")
    public List<AsignacionGuia> getAsignacionesByGuiaAndFecha(
            @RequestParam Long idGuia, 
            @RequestParam String fecha) {
        try {
            LocalDate fechaConsulta = LocalDate.parse(fecha);
            return asignacionService.findByGuiaAndFecha(idGuia, fechaConsulta);
        } catch (Exception e) {
            return List.of();
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<AsignacionGuia> updateAsignacion(
            @PathVariable Long id, 
            @RequestBody AsignacionGuia asignacion) {
        try {
            AsignacionGuia updatedAsignacion = asignacionService.update(id, asignacion);
            if (updatedAsignacion != null) {
                return ResponseEntity.ok(updatedAsignacion);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/iniciar/{id}")
    public ResponseEntity<Map<String, Object>> iniciarRecorrido(@PathVariable Long id) {
        try {
            AsignacionGuia asignacion = asignacionService.iniciarRecorrido(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("idAsignacion", asignacion.getIdAsignacion());
            response.put("horaInicioReal", asignacion.getHoraInicioReal());
            response.put("mensaje", "Recorrido iniciado exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No se pudo iniciar el recorrido");
            error.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/finalizar/{id}")
    public ResponseEntity<Map<String, Object>> finalizarRecorrido(
            @PathVariable Long id, 
            @RequestParam(required = false) String observaciones) {
        try {
            AsignacionGuia asignacion = asignacionService.finalizarRecorrido(id, observaciones);
            
            Map<String, Object> response = new HashMap<>();
            response.put("idAsignacion", asignacion.getIdAsignacion());
            response.put("horaInicioReal", asignacion.getHoraInicioReal());
            response.put("horaFinReal", asignacion.getHoraFinReal());
            response.put("estadoReserva", asignacion.getReserva().getEstado());
            response.put("mensaje", "Recorrido finalizado exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No se pudo finalizar el recorrido");
            error.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteAsignacion(@PathVariable Long id) {
        boolean deleted = asignacionService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.notFound().build();
    }
}