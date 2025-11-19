package com.uptc.bases2.demo.services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.bases2.demo.models.Reserva;
import com.uptc.bases2.demo.models.Sendero;
import com.uptc.bases2.demo.repository.ReservaRepository;
import com.uptc.bases2.demo.repository.SenderoRepository;

@Service
public class ReservaService {
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private SenderoRepository senderoRepository;
    
    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }
    
    public Optional<Reserva> findById(Long id) {
        return reservaRepository.findById(id);
    }
    
    public List<Reserva> findByVisitanteId(Long idVisitante) {
        return reservaRepository.findByVisitanteId(idVisitante);
    }
    
    public List<Reserva> findBySenderoId(Long idSendero) {
        return reservaRepository.findBySenderoId(idSendero);
    }
    
    public List<Reserva> findByEstado(String estado) {
        return reservaRepository.findByEstado(estado);
    }
    
    public List<Reserva> findReservasSinGuia() {
        return reservaRepository.findReservasSinGuia();
    }
    
    public Integer getCupoDisponible(Long idSendero, LocalDate fecha) {
        Optional<Sendero> senderoOpt = senderoRepository.findById(idSendero);
        if (senderoOpt.isEmpty()) {
            return 0;
        }
        
        Sendero sendero = senderoOpt.get();
        Integer cupoUsado = reservaRepository.countPersonasBySenderoAndFecha(idSendero, fecha);
        
        return sendero.getCupoMaximoDia() - cupoUsado;
    }
    
    public Reserva save(Reserva reserva) {
        if (reserva == null) {
            throw new IllegalArgumentException("La reserva no puede ser null");
        }
        
        if (reserva.getVisitante() == null) {
            throw new IllegalArgumentException("El visitante es obligatorio");
        }
        
        if (reserva.getSendero() == null) {
            throw new IllegalArgumentException("El sendero es obligatorio");
        }
        
        if (reserva.getFechaVisita() == null) {
            throw new IllegalArgumentException("La fecha de visita es obligatoria");
        }
        
        if (reserva.getNumeroPersonas() == null || reserva.getNumeroPersonas() <= 0) {
            throw new IllegalArgumentException("El número de personas debe ser mayor a 0");
        }
        
        if (reserva.getNumeroPersonas() > 20) {
            throw new IllegalArgumentException("El número de personas no puede exceder 20");
        }
        
        // Validar fecha de visita (mínimo 24 horas de anticipación)
        long diasAnticipacion = ChronoUnit.DAYS.between(LocalDate.now(), reserva.getFechaVisita());
        if (diasAnticipacion < 1) {
            throw new IllegalArgumentException("La reserva debe hacerse con mínimo 24 horas de anticipación");
        }
        
        // Validar cupo disponible
        Integer cupoDisponible = getCupoDisponible(reserva.getSendero().getIdSendero(), reserva.getFechaVisita());
        if (cupoDisponible < reserva.getNumeroPersonas()) {
            throw new IllegalArgumentException("No hay cupo disponible. Disponible: " + cupoDisponible);
        }
        
        // Validar máximo 2 reservas activas por visitante
        if (reserva.getIdReserva() == null) {
            List<Reserva> reservasActivas = reservaRepository.findReservasActivasByVisitante(reserva.getVisitante().getIdVisitante());
            if (reservasActivas.size() >= 2) {
                throw new IllegalArgumentException("Un visitante puede tener máximo 2 reservas activas");
            }
        }
        
        return reservaRepository.save(reserva);
    }
    
    public Reserva update(Long id, Reserva reserva) {
        if (reservaRepository.existsById(id)) {
            reserva.setIdReserva(id);
            reserva.setFechaModificacion(LocalDate.now());
            return save(reserva);
        }
        return null;
    }
    
    public Reserva cancelar(Long id, String motivo) {
        Optional<Reserva> reservaOpt = findById(id);
        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }
        
        Reserva reserva = reservaOpt.get();
        
        if (reserva.getEstado().equals("CANCELADA")) {
            throw new IllegalArgumentException("La reserva ya está cancelada");
        }
        
        if (reserva.getEstado().equals("COMPLETADA")) {
            throw new IllegalArgumentException("No se puede cancelar una reserva completada");
        }
        
        reserva.setEstado("CANCELADA");
        reserva.setObservaciones(motivo);
        reserva.setFechaModificacion(LocalDate.now());
        
        return reservaRepository.save(reserva);
    }
    
    public boolean deleteById(Long id) {
        if (reservaRepository.existsById(id)) {
            reservaRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean existsById(Long id) {
        return reservaRepository.existsById(id);
    }
}