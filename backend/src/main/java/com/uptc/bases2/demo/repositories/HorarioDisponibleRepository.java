package com.uptc.bases2.demo.repositories;

import com.uptc.bases2.demo.models.entities.HorarioDisponible;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

/**
 * Repository para la entidad HorarioDisponible
 */
@Repository
public interface HorarioDisponibleRepository extends JpaRepository<HorarioDisponible, Long> {

    /**
     * Buscar horarios por sendero
     */
    List<HorarioDisponible> findBySenderoIdSendero(Long senderoId);

    /**
     * Buscar horarios activos por sendero
     */
    @Query("SELECT h FROM HorarioDisponible h " +
           "WHERE h.sendero.idSendero = :senderoId AND h.activo = true " +
           "ORDER BY h.horaInicio ASC")
    List<HorarioDisponible> findHorariosActivosBySendero(@Param("senderoId") Long senderoId);

    /**
     * Buscar horarios por sendero y día de la semana
     */
    @Query("SELECT h FROM HorarioDisponible h " +
           "WHERE h.sendero.idSendero = :senderoId " +
           "AND h.activo = true " +
           "AND h.diasSemana LIKE %:dia% " +
           "ORDER BY h.horaInicio ASC")
    List<HorarioDisponible> findBySenderoAndDia(@Param("senderoId") Long senderoId, 
                                                 @Param("dia") String dia);

    /**
     * Verificar si existe un horario que se solape con otro
     */
    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END " +
           "FROM HorarioDisponible h " +
           "WHERE h.sendero.idSendero = :senderoId " +
           "AND h.activo = true " +
           "AND ((h.horaInicio <= :horaInicio AND h.horaFin > :horaInicio) " +
           "OR (h.horaInicio < :horaFin AND h.horaFin >= :horaFin) " +
           "OR (h.horaInicio >= :horaInicio AND h.horaFin <= :horaFin))")
    boolean existeSolapamiento(@Param("senderoId") Long senderoId, 
                               @Param("horaInicio") LocalTime horaInicio, 
                               @Param("horaFin") LocalTime horaFin);

    /**
     * Buscar todos los horarios activos
     */
    @Query("SELECT h FROM HorarioDisponible h WHERE h.activo = true " +
           "ORDER BY h.sendero.nombre, h.horaInicio ASC")
    List<HorarioDisponible> findAllActivos();
}
