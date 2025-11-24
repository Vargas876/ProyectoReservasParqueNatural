package com.uptc.bases2.demo.repositories;

import com.uptc.bases2.demo.models.entities.Reserva;
import com.uptc.bases2.demo.models.enums.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Repository para la entidad Reserva
 */
@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    /**
     * Buscar reservas por visitante
     */
    List<Reserva> findByVisitanteId(Long visitanteId);

    /**
     * Buscar reservas activas de un visitante
     */
    @Query("SELECT r FROM Reserva r WHERE r.visitante.id = :visitanteId " +
           "AND r.estado IN ('PENDIENTE', 'CONFIRMADA') " +
           "ORDER BY r.fechaVisita ASC")
    List<Reserva> findReservasActivasByVisitante(@Param("visitanteId") Long visitanteId);

    /**
     * Buscar reservas por sendero
     */
    List<Reserva> findBySenderoIdSendero(Long senderoId);

    /**
     * Buscar reservas por fecha de visita
     */
    List<Reserva> findByFechaVisita(LocalDate fechaVisita);

    /**
     * Buscar reservas por sendero y fecha
     */
    @Query("SELECT r FROM Reserva r WHERE r.sendero.idSendero = :senderoId " +
           "AND r.fechaVisita = :fecha " +
           "AND r.estado IN ('PENDIENTE', 'CONFIRMADA')")
    List<Reserva> findReservasActivasBySenderoYFecha(@Param("senderoId") Long senderoId, 
                                                      @Param("fecha") LocalDate fecha);

    /**
     * Buscar reservas por estado
     */
    List<Reserva> findByEstado(EstadoReserva estado);

    /**
     * Contar personas reservadas para un sendero en una fecha específica
     */
    @Query("SELECT COALESCE(SUM(r.numeroPersonas), 0) FROM Reserva r " +
           "WHERE r.sendero.idSendero = :senderoId " +
           "AND r.fechaVisita = :fecha " +
           "AND r.estado IN ('PENDIENTE', 'CONFIRMADA')")
    Integer contarPersonasReservadas(@Param("senderoId") Long senderoId, 
                                      @Param("fecha") LocalDate fecha);

    /**
     * Verificar disponibilidad de cupo para una reserva
     */
    @Query("SELECT CASE WHEN " +
           "(s.cupoMaximoDia - COALESCE(SUM(r.numeroPersonas), 0)) >= :numeroPersonas " +
           "THEN true ELSE false END " +
           "FROM Sendero s LEFT JOIN s.reservas r " +
           "ON r.fechaVisita = :fecha AND r.estado IN ('PENDIENTE', 'CONFIRMADA') " +
           "WHERE s.idSendero = :senderoId " +
           "GROUP BY s.cupoMaximoDia")
    boolean verificarDisponibilidad(@Param("senderoId") Long senderoId, 
                                     @Param("fecha") LocalDate fecha, 
                                     @Param("numeroPersonas") Integer numeroPersonas);

    /**
     * Buscar reservas pendientes de asignación de guía
     */
    @Query("SELECT r FROM Reserva r WHERE r.estado = 'CONFIRMADA' " +
           "AND r.asignacionGuia IS NULL " +
           "ORDER BY r.fechaVisita ASC")
    List<Reserva> findReservasPendientesAsignacion();

    /**
     * Buscar reservas por rango de fechas
     */
    @Query("SELECT r FROM Reserva r WHERE r.fechaVisita BETWEEN :fechaInicio AND :fechaFin " +
           "ORDER BY r.fechaVisita ASC")
    List<Reserva> findByFechaVisitaBetween(@Param("fechaInicio") LocalDate fechaInicio, 
                                            @Param("fechaFin") LocalDate fechaFin);

    /**
     * Verificar si existe conflicto de horario para un visitante
     */
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Reserva r " +
           "WHERE r.visitante.id = :visitanteId " +
           "AND r.fechaVisita = :fecha " +
           "AND r.horaInicio = :hora " +
           "AND r.estado IN ('PENDIENTE', 'CONFIRMADA')")
    boolean existeConflictoHorario(@Param("visitanteId") Long visitanteId, 
                                    @Param("fecha") LocalDate fecha, 
                                    @Param("hora") LocalTime hora);

    /**
     * Obtener estadísticas de reservas por mes
     */
    @Query("SELECT MONTH(r.fechaVisita) as mes, COUNT(r) as total " +
           "FROM Reserva r WHERE YEAR(r.fechaVisita) = :anio " +
           "GROUP BY MONTH(r.fechaVisita) ORDER BY mes")
    List<Object[]> obtenerEstadisticasPorMes(@Param("anio") int anio);
}
