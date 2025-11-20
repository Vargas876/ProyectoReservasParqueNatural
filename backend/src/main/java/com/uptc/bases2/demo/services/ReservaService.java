package com.uptc.bases2.demo.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.bases2.demo.models.Reserva;
import com.uptc.bases2.demo.models.Sendero;
import com.uptc.bases2.demo.repository.ReservaRepository;
import com.uptc.bases2.demo.repository.SenderoRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Service
public class ReservaService {
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private SenderoRepository senderoRepository;
    
    @Autowired
    private HorarioDisponibleService horarioDisponibleService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
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
    
    public List<Map<String, String>> getHorariosDisponibles(Long senderoId, LocalDate fecha) {
        // Obtener el día de la semana en español y en mayúsculas
        String diaSemana = fecha.getDayOfWeek()
                .getDisplayName(TextStyle.FULL, new Locale("es", "ES"))
                .toUpperCase();
        
        // ⬇️ AGREGAR ESTE LOG PARA DEBUG
        System.out.println("=== DEBUG HORARIOS ===");
        System.out.println("Fecha recibida: " + fecha);
        System.out.println("Día de la semana calculado: " + diaSemana);
        System.out.println("Sendero ID: " + senderoId);
        
        // Query corregida con el nombre correcto de la tabla
        String sql = "SELECT h.HORA_INICIO, h.HORA_FIN " +
                     "FROM HORARIO_DISPONIBLE h " +
                     "WHERE h.ID_SENDERO = :senderoId " +
                     "AND UPPER(h.DIA_SEMANA) = :diaSemana " +
                     "AND h.ESTADO = 'ACTIVO' " +
                     "ORDER BY h.HORA_INICIO";
        
        System.out.println("SQL Query: " + sql);
        System.out.println("Parámetros: senderoId=" + senderoId + ", diaSemana=" + diaSemana);
        
        try {
            Query query = entityManager.createNativeQuery(sql);
            query.setParameter("senderoId", senderoId);
            query.setParameter("diaSemana", diaSemana);
            
            @SuppressWarnings("unchecked")
            List<Object[]> resultados = query.getResultList();
            
            System.out.println("Resultados encontrados: " + resultados.size());
            
            
            // Si no hay horarios para este día, verificar si el sendero tiene horarios en general
            // Si no tiene ningún horario, crear horarios por defecto
            if (resultados.isEmpty()) {
                List<com.uptc.bases2.demo.models.HorarioDisponible> horariosGenerales = 
                    horarioDisponibleService.findBySenderoId(senderoId);
                
                if (horariosGenerales.isEmpty()) {
                    // No hay horarios para este sendero, crear horarios por defecto
                    try {
                        horarioDisponibleService.crearHorariosPorDefecto(senderoId);
                        // Volver a consultar después de crear los horarios
                        query = entityManager.createNativeQuery(sql);
                        query.setParameter("senderoId", senderoId);
                        query.setParameter("diaSemana", diaSemana);
                        resultados = query.getResultList();
                    } catch (Exception e) {
                        System.err.println("Error al crear horarios por defecto: " + e.getMessage());
                        // Continuar con lista vacía si falla la creación
                    }
                }
            }
            
            List<Map<String, String>> horarios = new ArrayList<>();
            
            for (Object[] resultado : resultados) {
                Map<String, String> horario = new HashMap<>();
                
                // Convertir a String de forma segura
                String horaInicio = resultado[0] != null ? resultado[0].toString() : "";
                String horaFin = resultado[1] != null ? resultado[1].toString() : "";
                
                // Si viene como timestamp, extraer solo HH:mm
                if (horaInicio.length() > 5) {
                    horaInicio = horaInicio.substring(0, 5);
                }
                if (horaFin.length() > 5) {
                    horaFin = horaFin.substring(0, 5);
                }
                
                horario.put("horaInicio", horaInicio);
                horario.put("horaFin", horaFin);
                horario.put("diaSemana", diaSemana);
                
                horarios.add(horario);
            }
            
            return horarios;
        } catch (Exception e) {
            // Log del error para debug
            System.err.println("Error al obtener horarios: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
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
        
        // Verificar y crear horarios por defecto si no existen (para evitar error del trigger)
        try {
            Long idSendero = reserva.getSendero().getIdSendero();
            List<com.uptc.bases2.demo.models.HorarioDisponible> horarios = 
                horarioDisponibleService.findBySenderoId(idSendero);
            
            // Si no hay horarios, crear horarios por defecto automáticamente
            if (horarios.isEmpty()) {
                horarioDisponibleService.crearHorariosPorDefecto(idSendero);
            }
        } catch (Exception e) {
            // Si falla la creación de horarios, continuar de todas formas
            // El trigger modificado debería permitir la reserva si no hay horarios
            System.err.println("Advertencia: No se pudieron crear horarios por defecto: " + e.getMessage());
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
    public List<Reserva> findByGuiaId(Long idGuia) {
        return reservaRepository.findByGuiaId(idGuia);
    }
    
    public List<Reserva> findByVisitanteCedula(String cedula) {
        return reservaRepository.findByVisitanteCedula(cedula);
    }
}