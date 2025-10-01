package com.uptc.bases2.demo.controllers;

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

import com.uptc.bases2.demo.models.Reserva;
import com.uptc.bases2.demo.services.ReservaService;

@RestController
@RequestMapping("/reserva")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;
    
    @GetMapping("/findAll")
    public List<Reserva> getAllReservas() {
        return reservaService.findAll();
    }

    @PostMapping("/save")
    public ResponseEntity<Reserva> createReserva(@RequestBody Reserva reserva) {
        try {
            Reserva nuevaReserva = reservaService.save(reserva);
            return ResponseEntity.ok(nuevaReserva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable Long id) {
        return reservaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByVisitante/{idVisitante}")
    public List<Reserva> getReservasByVisitante(@PathVariable Long idVisitante) {
        return reservaService.findByVisitanteId(idVisitante);
    }
    
    @GetMapping("/findBySendero/{idSendero}")
    public List<Reserva> getReservasBySendero(@PathVariable Long idSendero) {
        return reservaService.findBySenderoId(idSendero);
    }
    
    @GetMapping("/findByEstado/{estado}")
    public List<Reserva> getReservasByEstado(@PathVariable String estado) {
        return reservaService.findByEstado(estado);
    }
    
    @GetMapping("/sinGuia")
    public List<Reserva> getReservasSinGuia() {
        return reservaService.findReservasSinGuia();
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<Reserva> updateReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        try {
            Reserva updatedReserva = reservaService.update(id, reserva);
            if (updatedReserva != null) {
                return ResponseEntity.ok(updatedReserva);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/cancelar/{id}")
    public ResponseEntity<Map<String, Object>> cancelarReserva(
            @PathVariable Long id, 
            @RequestParam(required = false) String motivo) {
        try {
            Reserva reservaCancelada = reservaService.cancelar(id, motivo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("idReserva", reservaCancelada.getIdReserva());
            response.put("estado", reservaCancelada.getEstado());
            response.put("mensaje", "Reserva cancelada exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteReserva(@PathVariable Long id) {
        boolean deleted = reservaService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.notFound().build();
    }
}