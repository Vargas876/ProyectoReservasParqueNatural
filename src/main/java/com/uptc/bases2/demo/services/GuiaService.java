package com.uptc.bases2.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.bases2.demo.models.Guia;
import com.uptc.bases2.demo.repository.GuiaRepository;

@Service
public class GuiaService {
    
    @Autowired
    private GuiaRepository guiaRepository;
    
    public List<Guia> findAll() {
        return guiaRepository.findAll();
    }
    
    public Optional<Guia> findById(Long id) {
        return guiaRepository.findById(id);
    }
    
    public Optional<Guia> findByCedula(String cedula) {
        return guiaRepository.findByCedula(cedula);
    }
    
    public List<Guia> findByEstado(String estado) {
        return guiaRepository.findByEstado(estado);
    }
    
    public List<Guia> findAllActivos() {
        return guiaRepository.findAllActivos();
    }
    
    public List<Guia> findByEspecialidad(String especialidad) {
        return guiaRepository.findByEspecialidad(especialidad);
    }
    
    public Guia save(Guia guia) {
        if (guia == null) {
            throw new IllegalArgumentException("El guía no puede ser null");
        }
        
        if (guia.getCedula() == null || guia.getCedula().trim().isEmpty()) {
            throw new IllegalArgumentException("La cédula es obligatoria");
        }
        
        if (guia.getNombre() == null || guia.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        
        if (guia.getApellido() == null || guia.getApellido().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        
        // Validar cédula única
        if (guia.getIdGuia() == null || 
            !guia.getCedula().equals(findById(guia.getIdGuia()).map(Guia::getCedula).orElse(""))) {
            if (guiaRepository.existsByCedula(guia.getCedula())) {
                throw new IllegalArgumentException("La cédula ya está registrada");
            }
        }
        
        if (guia.getMaxPersonasGrupo() != null && guia.getMaxPersonasGrupo() <= 0) {
            throw new IllegalArgumentException("El máximo de personas debe ser mayor a 0");
        }
        
        return guiaRepository.save(guia);
    }
    
    public Guia update(Long id, Guia guia) {
        if (guiaRepository.existsById(id)) {
            guia.setIdGuia(id);
            return save(guia);
        }
        return null;
    }
    
    public boolean deleteById(Long id) {
        if (guiaRepository.existsById(id)) {
            guiaRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean existsById(Long id) {
        return guiaRepository.existsById(id);
    }
}