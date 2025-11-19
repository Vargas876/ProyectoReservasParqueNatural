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

import com.uptc.bases2.demo.models.Visitante;
import com.uptc.bases2.demo.services.VisitanteService;

@RestController
@RequestMapping("/visitante")
public class VisitanteController {

    @Autowired
    private VisitanteService visitanteService;
    
    @GetMapping("/findAll")
    public List<Visitante> getAllVisitantes() {
        return visitanteService.findAll();
    }

    @PostMapping("/save")
    public ResponseEntity<Visitante> createVisitante(@RequestBody Visitante visitante) {
        try {
            Visitante nuevoVisitante = visitanteService.save(visitante);
            return ResponseEntity.ok(nuevoVisitante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Visitante> getVisitanteById(@PathVariable Long id) {
        return visitanteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByCedula/{cedula}")
    public ResponseEntity<Visitante> getVisitanteByCedula(@PathVariable String cedula) {
        return visitanteService.findByCedula(cedula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByEmail")
    public ResponseEntity<Visitante> getVisitanteByEmail(@RequestParam String email) {
        return visitanteService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByEstado/{estado}")
    public List<Visitante> getVisitantesByEstado(@PathVariable String estado) {
        return visitanteService.findByEstado(estado);
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<Visitante> updateVisitante(@PathVariable Long id, @RequestBody Visitante visitante) {
        try {
            Visitante updatedVisitante = visitanteService.update(id, visitante);
            if (updatedVisitante != null) {
                return ResponseEntity.ok(updatedVisitante);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteVisitante(@PathVariable Long id) {
        boolean deleted = visitanteService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.notFound().build();
    }
}