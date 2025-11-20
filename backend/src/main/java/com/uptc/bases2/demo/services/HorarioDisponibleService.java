package com.uptc.bases2.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uptc.bases2.demo.models.HorarioDisponible;
import com.uptc.bases2.demo.models.Sendero;
import com.uptc.bases2.demo.repository.HorarioDisponibleRepository;
import com.uptc.bases2.demo.repository.SenderoRepository;

@Service
public class HorarioDisponibleService {
    
    @Autowired
    private HorarioDisponibleRepository horarioRepository;
    
    @Autowired
    private SenderoRepository senderoRepository;
    
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
        
        // ⬇️ CAMBIO: getCupoHorario() → getCupoPorHorario()
        if (horario.getCupoPorHorario() == null || horario.getCupoPorHorario() <= 0) {
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
    
    /**
     * Crea horarios por defecto para un sendero si no tiene horarios definidos
     * Crea horarios de 06:00 a 17:00 para todos los días de la semana
     */
    @Transactional
    public int crearHorariosPorDefecto(Long idSendero) {
        // Verificar si el sendero existe
        Optional<Sendero> senderoOpt = senderoRepository.findById(idSendero);
        if (senderoOpt.isEmpty()) {
            throw new IllegalArgumentException("Sendero no encontrado");
        }
        
        // Verificar si ya tiene horarios
        List<HorarioDisponible> horariosExistentes = horarioRepository.findBySenderoId(idSendero);
        if (!horariosExistentes.isEmpty()) {
            return 0; // Ya tiene horarios, no crear
        }
        
        // Días de la semana en español (como los espera el trigger)
        String[] diasSemana = {"LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"};
        int creados = 0;
        
        Sendero sendero = senderoOpt.get();
        
        // Crear un horario de 06:00 a 17:00 para cada día
        for (String dia : diasSemana) {
            HorarioDisponible horario = new HorarioDisponible();
            horario.setSendero(sendero);
            horario.setHoraInicio("06:00");
            horario.setHoraFin("17:00");
            // ⬇️ CAMBIO: setCupoHorario() → setCupoPorHorario()
            horario.setCupoPorHorario(50); // Cupo por defecto
            // ⬇️ CAMBIO: setDiasSemana() → setDiaSemana()
            horario.setDiaSemana(dia); // Se mapea a DIA_SEMANA en la BD
            
            try {
                horarioRepository.save(horario);
                creados++;
            } catch (Exception e) {
                // Si falla, continuar con el siguiente
                System.err.println("Error al crear horario para " + dia + ": " + e.getMessage());
            }
        }
        
        return creados;
    }
}