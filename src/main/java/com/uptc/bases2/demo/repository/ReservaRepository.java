package com.uptc.bases2.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uptc.bases2.demo.models.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    
    @Query("SELECT r FROM Reserva r WHERE r.visitante.idVisitante = :idVisitante")
    List<Reserva> findByVisitanteId(@Param("idVisitante") Long idVisitante);
    
    @Query("SELECT r FROM Reserva r WHERE r.sendero.idSendero = :idSendero")
    List<Reserva> findBySenderoId(@Param("idSendero") Long idSendero);
    
    @Query("SELECT r FROM Reserva r WHERE r.estado = :estado")
    List<Reserva> findByEstado(@Param("estado") String estado);
    
    @Query("SELECT r FROM Reserva r WHERE r.fechaVisita = :fecha")
    List<Reserva> findByFechaVisita(@Param("fecha") LocalDate fecha);
    
    @Query("SELECT r FROM Reserva r WHERE r.sendero.idSendero = :idSendero AND r.fechaVisita = :fecha AND r.estado IN ('PENDIENTE', 'CONFIRMADA')")
    List<Reserva> findBySenderoAndFechaActivas(@Param("idSendero") Long idSendero, @Param("fecha") LocalDate fecha);
    
    @Query("SELECT COALESCE(SUM(r.numeroPersonas), 0) FROM Reserva r WHERE r.sendero.idSendero = :idSendero AND r.fechaVisita = :fecha AND r.estado IN ('PENDIENTE', 'CONFIRMADA')")
    Integer countPersonasBySenderoAndFecha(@Param("idSendero") Long idSendero, @Param("fecha") LocalDate fecha);
    
    @Query("SELECT r FROM Reserva r WHERE r.visitante.idVisitante = :idVisitante AND r.estado IN ('PENDIENTE', 'CONFIRMADA')")
    List<Reserva> findReservasActivasByVisitante(@Param("idVisitante") Long idVisitante);
    
    @Query("SELECT r FROM Reserva r WHERE r.estado = 'CONFIRMADA' AND r.asignacion IS NULL")
    List<Reserva> findReservasSinGuia();
    
    @Query("SELECT r FROM Reserva r WHERE r.fechaVisita BETWEEN :fechaInicio AND :fechaFin")
    List<Reserva> findByRangoFechas(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
}