package com.uptc.bases2.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.bases2.demo.models.HorarioDisponible;
import com.uptc.bases2.demo.repository.HorarioDisponibleRepository;

@Service
public class HorarioDisponibleService {
    
    @Autowired
    private HorarioDisponibleRepository horarioRepository;
    
    public List<HorarioDisponible> findAll() {
        return horarioRepository.findAll();
    }
    
    public Optional<HorarioDisponible> findById(Long id) {
        return horarioRepository.findById(id);
    }
    
    public List<HorarioDisponible> findBySenderoId(Long idSendero) {
        return horarioRepository.findBySenderoId(idSendero);
    }
    
    public List<HorarioDisponible> findBySenderoAndDia(Long idSendero, String dia) {
        return horarioRepository.findBySenderoAndDia(idSendero, dia);
    }
    
    public HorarioDisponible save(HorarioDisponible horario) {
        if (horario == null) {
            throw new IllegalArgumentException("El horario no puede ser null");
        }
        
        if (horario.getSendero() == null) {
            throw new IllegalArgumentException("El sendero es obligatorio");
        }
        
        if (horario.getHoraInicio() == null || horario.getHoraInicio().trim().isEmpty()) {
            throw new IllegalArgumentException("La hora de inicio es obligatoria");
        }
        
        if (horario.getHoraFin() == null || horario.getHoraFin().trim().isEmpty()) {
            throw new IllegalArgumentException("La hora de fin es obligatoria");
        }
        
        if (horario.getCupoHorario() == null || horario.getCupoHorario() <= 0) {
            throw new IllegalArgumentException("El cupo debe ser mayor a 0");
        }
        
        // Validar formato de hora (HH:MM)
        if (!horario.getHoraInicio().matches("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")) {
            throw new IllegalArgumentException("El formato de hora de inicio debe ser HH:MM");
        }
        
        if (!horario.getHoraFin().matches("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")) {
            throw new IllegalArgumentException("El formato de hora de fin debe ser HH:MM");
        }
        
        return horarioRepository.save(horario);
    }
    
    public HorarioDisponible update(Long id, HorarioDisponible horario) {
        if (horarioRepository.existsById(id)) {
            horario.setIdHorario(id);
            return save(horario);
        }
        return null;
    }
    
    public boolean deleteById(Long id) {
        if (horarioRepository.existsById(id)) {
            horarioRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean existsById(Long id) {
        return horarioRepository.existsById(id);
    }
}