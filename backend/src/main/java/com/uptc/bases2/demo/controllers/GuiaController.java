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
import com.uptc.bases2.demo.models.Guia;
import com.uptc.bases2.demo.services.AsignacionGuiaService;
import com.uptc.bases2.demo.services.GuiaService;

@RestController
@RequestMapping("/guia")
public class GuiaController {

    @Autowired
    private GuiaService guiaService;
    
    @Autowired
    private AsignacionGuiaService asignacionService;
    
    @GetMapping("/findAll")
    public List<Guia> getAllGuias() {
        return guiaService.findAll();
    }
    
    @GetMapping("/findAllActivos")
    public List<Guia> getAllGuiasActivos() {
        return guiaService.findAllActivos();
    }

    @PostMapping("/save")
    public ResponseEntity<Guia> createGuia(@RequestBody Guia guia) {
        try {
            Guia nuevoGuia = guiaService.save(guia);
            return ResponseEntity.ok(nuevoGuia);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Guia> getGuiaById(@PathVariable Long id) {
        return guiaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByCedula/{cedula}")
    public ResponseEntity<Guia> getGuiaByCedula(@PathVariable String cedula) {
        return guiaService.findByCedula(cedula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByEstado/{estado}")
    public List<Guia> getGuiasByEstado(@PathVariable String estado) {
        return guiaService.findByEstado(estado);
    }
    
    @GetMapping("/findByEspecialidad")
    public List<Guia> getGuiasByEspecialidad(@RequestParam String especialidad) {
        return guiaService.findByEspecialidad(especialidad);
    }
    
    @GetMapping("/agenda/{id}")
    public ResponseEntity<Map<String, Object>> getAgenda(
            @PathVariable Long id, 
            @RequestParam(required = false) String fecha) {
        try {
            LocalDate fechaConsulta = fecha != null ? LocalDate.parse(fecha) : LocalDate.now();
            
            return guiaService.findById(id).map(guia -> {
                List<AsignacionGuia> asignaciones = asignacionService.findByGuiaAndFecha(id, fechaConsulta);
                
                Map<String, Object> response = new HashMap<>();
                response.put("idGuia", guia.getIdGuia());
                response.put("nombreGuia", guia.getNombre() + " " + guia.getApellido());
                response.put("fecha", fechaConsulta.toString());
                response.put("asignaciones", asignaciones);
                response.put("totalAsignaciones", asignaciones.size());
                
                return ResponseEntity.ok(response);
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<Guia> updateGuia(@PathVariable Long id, @RequestBody Guia guia) {
        try {
            Guia updatedGuia = guiaService.update(id, guia);
            if (updatedGuia != null) {
                return ResponseEntity.ok(updatedGuia);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteGuia(@PathVariable Long id) {
        boolean deleted = guiaService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.notFound().build();
    }
   
    
   
    
    @GetMapping("/disponibles")
    public List<Guia> getGuiasDisponibles(
            @RequestParam Long senderoId,
            @RequestParam String fecha,
            @RequestParam String horaInicio) {
        return guiaService.findDisponibles(senderoId, fecha, horaInicio);
    }
}