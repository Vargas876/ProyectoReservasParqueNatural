package com.uptc.bases2.demo.repositories;

import com.uptc.bases2.demo.models.entities.Guia;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository para la entidad Guia
 */
@Repository
public interface GuiaRepository extends JpaRepository<Guia, Long> {

    /**
     * Buscar guía por email
     */
    Optional<Guia> findByEmail(String email);

    /**
     * Buscar guía por cédula
     */
    Optional<Guia> findByCedula(String cedula);

    /**
     * Buscar guías por estado
     */
    List<Guia> findByEstado(EstadoGeneral estado);

    /**
     * Buscar guías activos
     */
    @Query("SELECT g FROM Guia g WHERE g.estado = 'ACTIVO'")
    List<Guia> findAllActivos();

    /**
     * Buscar guías disponibles para una fecha específica (menos de 2 recorridos ese día)
     */
    @Query("SELECT g FROM Guia g WHERE g.estado = 'ACTIVO' " +
           "AND (SELECT COUNT(a) FROM AsignacionGuia a " +
           "WHERE a.guia.id = g.id AND a.reserva.fechaVisita = :fecha) < 2")
    List<Guia> findGuiasDisponiblesPorFecha(@Param("fecha") LocalDate fecha);

    /**
     * Contar asignaciones de un guía en una fecha específica
     */
    @Query("SELECT COUNT(a) FROM AsignacionGuia a " +
           "WHERE a.guia.id = :guiaId " +
           "AND a.reserva.fechaVisita = :fecha")
    long contarAsignacionesPorFecha(@Param("guiaId") Long guiaId, 
                                     @Param("fecha") LocalDate fecha);

    /**
     * Verificar si un guía puede tomar más recorridos en una fecha (máximo 2)
     */
    @Query("SELECT CASE WHEN COUNT(a) < 2 THEN true ELSE false END " +
           "FROM AsignacionGuia a " +
           "WHERE a.guia.id = :guiaId AND a.reserva.fechaVisita = :fecha")
    boolean puedeTomarRecorrido(@Param("guiaId") Long guiaId, 
                                 @Param("fecha") LocalDate fecha);

    /**
     * Buscar guías con capacidad para un número específico de personas
     */
    @Query("SELECT g FROM Guia g WHERE g.estado = 'ACTIVO' " +
           "AND g.maxPersonasGrupo >= :numeroPersonas")
    List<Guia> findByCapacidadMinima(@Param("numeroPersonas") Integer numeroPersonas);

    /**
     * Obtener guías ordenados por calificación
     */
    @Query("SELECT g FROM Guia g WHERE g.estado = 'ACTIVO' " +
           "ORDER BY g.calificacionPromedio DESC")
    List<Guia> findTopGuiasByCalificacion();

    /**
     * Buscar guías por especialidad
     */
    @Query("SELECT g FROM Guia g WHERE g.estado = 'ACTIVO' " +
           "AND LOWER(g.especialidades) LIKE LOWER(CONCAT('%', :especialidad, '%'))")
    List<Guia> findByEspecialidad(@Param("especialidad") String especialidad);
}
