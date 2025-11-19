package com.uptc.bases2.demo.controllers;

import java.util.List;

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

import com.uptc.bases2.demo.models.HorarioDisponible;
import com.uptc.bases2.demo.services.HorarioDisponibleService;

@RestController
@RequestMapping("/horario")
public class HorarioDisponibleController {

    @Autowired
    private HorarioDisponibleService horarioService;
    
    @GetMapping("/findAll")
    public List<HorarioDisponible> getAllHorarios() {
        return horarioService.findAll();
    }

    @PostMapping("/save")
    public ResponseEntity<HorarioDisponible> createHorario(@RequestBody HorarioDisponible horario) {
        try {
            HorarioDisponible nuevoHorario = horarioService.save(horario);
            return ResponseEntity.ok(nuevoHorario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<HorarioDisponible> getHorarioById(@PathVariable Long id) {
        return horarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findBySendero/{idSendero}")
    public List<HorarioDisponible> getHorariosBySendero(@PathVariable Long idSendero) {
        return horarioService.findBySenderoId(idSendero);
    }
    
    @GetMapping("/findBySenderoAndDia")
    public List<HorarioDisponible> getHorariosBySenderoAndDia(
            @RequestParam Long idSendero, 
            @RequestParam String dia) {
        return horarioService.findBySenderoAndDia(idSendero, dia);
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<HorarioDisponible> updateHorario(
            @PathVariable Long id, 
            @RequestBody HorarioDisponible horario) {
        try {
            HorarioDisponible updatedHorario = horarioService.update(id, horario);
            if (updatedHorario != null) {
                return ResponseEntity.ok(updatedHorario);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteHorario(@PathVariable Long id) {
        boolean deleted = horarioService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.notFound().build();
    }
}