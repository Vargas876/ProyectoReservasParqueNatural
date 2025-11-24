package com.uptc.bases2.demo.repositories;

import com.uptc.bases2.demo.models.entities.AsignacionGuia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository para la entidad AsignacionGuia
 */
@Repository
public interface AsignacionGuiaRepository extends JpaRepository<AsignacionGuia, Long> {

    /**
     * Buscar asignación por reserva
     */
    Optional<AsignacionGuia> findByReservaIdReserva(Long idReserva);

    /**
     * Buscar asignaciones por guía
     */
    List<AsignacionGuia> findByGuiaId(Long guiaId);

    /**
     * Buscar asignaciones de un guía en una fecha específica
     */
    @Query("SELECT a FROM AsignacionGuia a WHERE a.guia.id = :guiaId " +
           "AND a.reserva.fechaVisita = :fecha " +
           "ORDER BY a.reserva.horaInicio ASC")
    List<AsignacionGuia> findByGuiaIdAndFecha(@Param("guiaId") Long guiaId, 
                                               @Param("fecha") LocalDate fecha);

    /**
     * Buscar asignaciones activas (reserva confirmada y no finalizada)
     */
    @Query("SELECT a FROM AsignacionGuia a " +
           "WHERE a.reserva.estado = 'CONFIRMADA' " +
           "AND a.horaFinReal IS NULL " +
           "ORDER BY a.reserva.fechaVisita ASC, a.reserva.horaInicio ASC")
    List<AsignacionGuia> findAsignacionesActivas();

    /**
     * Buscar asignaciones en curso (iniciadas pero no finalizadas)
     */
    @Query("SELECT a FROM AsignacionGuia a " +
           "WHERE a.horaInicioReal IS NOT NULL " +
           "AND a.horaFinReal IS NULL")
    List<AsignacionGuia> findAsignacionesEnCurso();

    /**
     * Verificar si una reserva ya tiene guía asignado
     */
    boolean existsByReservaIdReserva(Long idReserva);

    /**
     * Obtener agenda completa de un guía por rango de fechas
     */
    @Query("SELECT a FROM AsignacionGuia a " +
           "WHERE a.guia.id = :guiaId " +
           "AND a.reserva.fechaVisita BETWEEN :fechaInicio AND :fechaFin " +
           "ORDER BY a.reserva.fechaVisita ASC, a.reserva.horaInicio ASC")
    List<AsignacionGuia> findAgendaGuia(@Param("guiaId") Long guiaId, 
                                         @Param("fechaInicio") LocalDate fechaInicio, 
                                         @Param("fechaFin") LocalDate fechaFin);

    /**
     * Contar asignaciones completadas por guía
     */
    @Query("SELECT COUNT(a) FROM AsignacionGuia a " +
           "WHERE a.guia.id = :guiaId " +
           "AND a.horaFinReal IS NOT NULL")
    long contarAsignacionesCompletadas(@Param("guiaId") Long guiaId);
}
