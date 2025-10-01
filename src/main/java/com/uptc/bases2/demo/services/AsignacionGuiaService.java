package com.uptc.bases2.demo.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.bases2.demo.models.AsignacionGuia;
import com.uptc.bases2.demo.models.Guia;
import com.uptc.bases2.demo.models.Reserva;
import com.uptc.bases2.demo.repository.AsignacionGuiaRepository;
import com.uptc.bases2.demo.repository.GuiaRepository;
import com.uptc.bases2.demo.repository.ReservaRepository;

@Service
public class AsignacionGuiaService {
    
    @Autowired
    private AsignacionGuiaRepository asignacionRepository;
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private GuiaRepository guiaRepository;
    
    public List<AsignacionGuia> findAll() {
        return asignacionRepository.findAll();
    }
    
    public Optional<AsignacionGuia> findById(Long id) {
        return asignacionRepository.findById(id);
    }
    
    public Optional<AsignacionGuia> findByReservaId(Long idReserva) {
        return asignacionRepository.findByReservaId(idReserva);
    }
    
    public List<AsignacionGuia> findByGuiaId(Long idGuia) {
        return asignacionRepository.findByGuiaId(idGuia);
    }
    
    public List<AsignacionGuia> findByGuiaAndFecha(Long idGuia, LocalDate fecha) {
        return asignacionRepository.findByGuiaAndFecha(idGuia, fecha);
    }
    
    public List<AsignacionGuia> findByFecha(LocalDate fecha) {
        return asignacionRepository.findByFecha(fecha);
    }
    
    public AsignacionGuia save(AsignacionGuia asignacion) {
        if (asignacion == null) {
            throw new IllegalArgumentException("La asignación no puede ser null");
        }
        
        if (asignacion.getReserva() == null) {
            throw new IllegalArgumentException("La reserva es obligatoria");
        }
        
        if (asignacion.getGuia() == null) {
            throw new IllegalArgumentException("El guía es obligatorio");
        }
        
        // Validar que la reserva exista
        Optional<Reserva> reservaOpt = reservaRepository.findById(asignacion.getReserva().getIdReserva());
        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("La reserva no existe");
        }
        
        Reserva reserva = reservaOpt.get();
        
        // Validar estado de la reserva
        if (!reserva.getEstado().equals("PENDIENTE") && !reserva.getEstado().equals("CONFIRMADA")) {
            throw new IllegalArgumentException("Solo se pueden asignar guías a reservas PENDIENTES o CONFIRMADAS");
        }
        
        // Validar que la reserva no tenga ya un guía asignado
        if (asignacion.getIdAsignacion() == null && asignacionRepository.existsByReservaId(reserva.getIdReserva())) {
            throw new IllegalArgumentException("La reserva ya tiene un guía asignado");
        }
        
        // Validar que el guía exista
        Optional<Guia> guiaOpt = guiaRepository.findById(asignacion.getGuia().getIdGuia());
        if (guiaOpt.isEmpty()) {
            throw new IllegalArgumentException("El guía no existe");
        }
        
        Guia guia = guiaOpt.get();
        
        // Validar que el guía esté activo
        if (!guia.getEstado().equals("ACTIVO")) {
            throw new IllegalArgumentException("El guía no está activo");
        }
        
        // Validar capacidad del guía
        if (reserva.getNumeroPersonas() > guia.getMaxPersonasGrupo()) {
            throw new IllegalArgumentException("El número de personas (" + reserva.getNumeroPersonas() + 
                ") excede la capacidad del guía (" + guia.getMaxPersonasGrupo() + ")");
        }
        
        // Validar máximo 2 recorridos por día para el guía
        Long asignacionesDelDia = asignacionRepository.countAsignacionesByGuiaAndFecha(
            guia.getIdGuia(), reserva.getFechaVisita());
        
        if (asignacion.getIdAsignacion() == null && asignacionesDelDia >= 2) {
            throw new IllegalArgumentException("El guía ya tiene 2 recorridos asignados para ese día");
        }
        
        // Guardar asignación
        AsignacionGuia asignacionGuardada = asignacionRepository.save(asignacion);
        
        // Actualizar estado de la reserva a CONFIRMADA
        if (!reserva.getEstado().equals("CONFIRMADA")) {
            reserva.setEstado("CONFIRMADA");
            reserva.setFechaModificacion(LocalDate.now());
            reservaRepository.save(reserva);
        }
        
        return asignacionGuardada;
    }
    
    public AsignacionGuia update(Long id, AsignacionGuia asignacion) {
        if (asignacionRepository.existsById(id)) {
            asignacion.setIdAsignacion(id);
            return save(asignacion);
        }
        return null;
    }
    
    public AsignacionGuia iniciarRecorrido(Long id) {
        Optional<AsignacionGuia> asignacionOpt = findById(id);
        if (asignacionOpt.isEmpty()) {
            throw new IllegalArgumentException("Asignación no encontrada");
        }
        
        AsignacionGuia asignacion = asignacionOpt.get();
        
        if (asignacion.getHoraInicioReal() != null) {
            throw new IllegalArgumentException("El recorrido ya fue iniciado");
        }
        
        asignacion.setHoraInicioReal(LocalDateTime.now());
        return asignacionRepository.save(asignacion);
    }
    
    public AsignacionGuia finalizarRecorrido(Long id, String observaciones) {
        Optional<AsignacionGuia> asignacionOpt = findById(id);
        if (asignacionOpt.isEmpty()) {
            throw new IllegalArgumentException("Asignación no encontrada");
        }
        
        AsignacionGuia asignacion = asignacionOpt.get();
        
        if (asignacion.getHoraInicioReal() == null) {
            throw new IllegalArgumentException("El recorrido no ha sido iniciado");
        }
        
        if (asignacion.getHoraFinReal() != null) {
            throw new IllegalArgumentException("El recorrido ya fue finalizado");
        }
        
        asignacion.setHoraFinReal(LocalDateTime.now());
        asignacion.setObservacionesGuia(observaciones);
        
        // Actualizar estado de la reserva a COMPLETADA
        Reserva reserva = asignacion.getReserva();
        reserva.setEstado("COMPLETADA");
        reserva.setFechaModificacion(LocalDate.now());
        reservaRepository.save(reserva);
        
        return asignacionRepository.save(asignacion);
    }
    
    public boolean deleteById(Long id) {
        if (asignacionRepository.existsById(id)) {
            asignacionRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean existsById(Long id) {
        return asignacionRepository.existsById(id);
    }
}