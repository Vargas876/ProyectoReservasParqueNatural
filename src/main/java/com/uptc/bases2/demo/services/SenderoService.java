package com.uptc.bases2.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.bases2.demo.models.Sendero;
import com.uptc.bases2.demo.repository.SenderoRepository;

@Service
public class SenderoService {
    
    @Autowired
    private SenderoRepository senderoRepository;
    
    public List<Sendero> findAll() {
        return senderoRepository.findAll();
    }
    
    public Optional<Sendero> findById(Long id) {
        return senderoRepository.findById(id);
    }
    
    public List<Sendero> findByEstado(String estado) {
        return senderoRepository.findByEstado(estado);
    }
    
    public List<Sendero> findByDificultad(String dificultad) {
        return senderoRepository.findByDificultad(dificultad);
    }
    
    public List<Sendero> findAllActivos() {
        return senderoRepository.findAllActivos();
    }
    
    public Sendero save(Sendero sendero) {
        if (sendero == null) {
            throw new IllegalArgumentException("El sendero no puede ser null");
        }
        
        if (sendero.getNombre() == null || sendero.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del sendero es obligatorio");
        }
        
        if (sendero.getDificultad() != null) {
            String dificultad = sendero.getDificultad().toUpperCase();
            if (!dificultad.equals("FACIL") && !dificultad.equals("MODERADO") && !dificultad.equals("DIFICIL")) {
                throw new IllegalArgumentException("La dificultad debe ser: FACIL, MODERADO o DIFICIL");
            }
            sendero.setDificultad(dificultad);
        }
        
        if (sendero.getDuracionHoras() != null && sendero.getDuracionHoras() <= 0) {
            throw new IllegalArgumentException("La duración debe ser mayor a 0");
        }
        
        if (sendero.getCupoMaximoDia() != null && sendero.getCupoMaximoDia() <= 0) {
            throw new IllegalArgumentException("El cupo máximo debe ser mayor a 0");
        }
        
        if (sendero.getDistanciaKm() != null && sendero.getDistanciaKm() <= 0) {
            throw new IllegalArgumentException("La distancia debe ser mayor a 0");
        }
        
        return senderoRepository.save(sendero);
    }
    
    public Sendero update(Long id, Sendero sendero) {
        if (senderoRepository.existsById(id)) {
            sendero.setIdSendero(id);
            return save(sendero);
        }
        return null;
    }
    
    public boolean deleteById(Long id) {
        if (senderoRepository.existsById(id)) {
            senderoRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean existsById(Long id) {
        return senderoRepository.existsById(id);
    }
}