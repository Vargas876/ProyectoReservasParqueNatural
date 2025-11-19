package com.uptc.bases2.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.bases2.demo.models.Visitante;
import com.uptc.bases2.demo.repository.VisitanteRepository;

@Service
public class VisitanteService {
    
    @Autowired
    private VisitanteRepository visitanteRepository;
    
    public List<Visitante> findAll() {
        return visitanteRepository.findAll();
    }
    
    public Optional<Visitante> findById(Long id) {
        return visitanteRepository.findById(id);
    }
    
    public Optional<Visitante> findByCedula(String cedula) {
        return visitanteRepository.findByCedula(cedula);
    }
    
    public Optional<Visitante> findByEmail(String email) {
        return visitanteRepository.findByEmail(email);
    }
    
    public List<Visitante> findByEstado(String estado) {
        return visitanteRepository.findByEstado(estado);
    }
    
    public Visitante save(Visitante visitante) {
        if (visitante == null) {
            throw new IllegalArgumentException("El visitante no puede ser null");
        }
        
        if (visitante.getCedula() == null || visitante.getCedula().trim().isEmpty()) {
            throw new IllegalArgumentException("La cédula es obligatoria");
        }
        
        if (visitante.getNombre() == null || visitante.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        
        if (visitante.getApellido() == null || visitante.getApellido().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        
        if (visitante.getEmail() == null || visitante.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        
        // Validar email único (solo si es nuevo o cambió el email)
        if (visitante.getIdVisitante() == null || 
            !visitante.getEmail().equals(findById(visitante.getIdVisitante()).map(Visitante::getEmail).orElse(""))) {
            if (visitanteRepository.existsByEmail(visitante.getEmail())) {
                throw new IllegalArgumentException("El email ya está registrado");
            }
        }
        
        // Validar cédula única (solo si es nuevo o cambió la cédula)
        if (visitante.getIdVisitante() == null || 
            !visitante.getCedula().equals(findById(visitante.getIdVisitante()).map(Visitante::getCedula).orElse(""))) {
            if (visitanteRepository.existsByCedula(visitante.getCedula())) {
                throw new IllegalArgumentException("La cédula ya está registrada");
            }
        }
        
        return visitanteRepository.save(visitante);
    }
    
    public Visitante update(Long id, Visitante visitante) {
        if (visitanteRepository.existsById(id)) {
            visitante.setIdVisitante(id);
            return save(visitante);
        }
        return null;
    }
    
    public boolean deleteById(Long id) {
        if (visitanteRepository.existsById(id)) {
            visitanteRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean existsById(Long id) {
        return visitanteRepository.existsById(id);
    }
}