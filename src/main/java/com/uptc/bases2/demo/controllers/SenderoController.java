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

import com.uptc.bases2.demo.models.Sendero;
import com.uptc.bases2.demo.services.ReservaService;
import com.uptc.bases2.demo.services.SenderoService;

@RestController
@RequestMapping("/sendero")
public class SenderoController {

    @Autowired
    private SenderoService senderoService;
    
    @Autowired
    private ReservaService reservaService;
    
    @GetMapping("/findAll")
    public List<Sendero> getAllSenderos() {
        return senderoService.findAll();
    }
    
    @GetMapping("/findAllActivos")
    public List<Sendero> getAllSenderosActivos() {
        return senderoService.findAllActivos();
    }

    @PostMapping("/save")
    public ResponseEntity<Sendero> createSendero(@RequestBody Sendero sendero) {
        try {
            Sendero nuevoSendero = senderoService.save(sendero);
            return ResponseEntity.ok(nuevoSendero);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Sendero> getSenderoById(@PathVariable Long id) {
        return senderoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByEstado/{estado}")
    public List<Sendero> getSenderosByEstado(@PathVariable String estado) {
        return senderoService.findByEstado(estado);
    }
    
    @GetMapping("/findByDificultad/{dificultad}")
    public List<Sendero> getSenderosByDificultad(@PathVariable String dificultad) {
        return senderoService.findByDificultad(dificultad);
    }
    
    @GetMapping("/disponibilidad/{id}")
    public ResponseEntity<Map<String, Object>> getDisponibilidad(
            @PathVariable Long id, 
            @RequestParam String fecha) {
        try {
            LocalDate fechaVisita = LocalDate.parse(fecha);
            
            return senderoService.findById(id).map(sendero -> {
                Integer cupoDisponible = reservaService.getCupoDisponible(id, fechaVisita);
                Integer cupoUsado = sendero.getCupoMaximoDia() - cupoDisponible;
                
                Map<String, Object> response = new HashMap<>();
                response.put("idSendero", sendero.getIdSendero());
                response.put("nombreSendero", sendero.getNombre());
                response.put("fecha", fecha);
                response.put("cupoMaximo", sendero.getCupoMaximoDia());
                response.put("cupoUsado", cupoUsado);
                response.put("cupoDisponible", cupoDisponible);
                response.put("disponible", cupoDisponible > 0);
                
                return ResponseEntity.ok(response);
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<Sendero> updateSendero(@PathVariable Long id, @RequestBody Sendero sendero) {
        try {
            Sendero updatedSendero = senderoService.update(id, sendero);
            if (updatedSendero != null) {
                return ResponseEntity.ok(updatedSendero);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteSendero(@PathVariable Long id) {
        boolean deleted = senderoService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.notFound().build();
    }
}