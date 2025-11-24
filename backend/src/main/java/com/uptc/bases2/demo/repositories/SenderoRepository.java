package com.uptc.bases2.demo.repositories;

import com.uptc.bases2.demo.models.entities.Sendero;
import com.uptc.bases2.demo.models.enums.Dificultad;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository para la entidad Sendero
 */
@Repository
public interface SenderoRepository extends JpaRepository<Sendero, Long> {

    /**
     * Buscar sendero por nombre
     */
    Optional<Sendero> findByNombre(String nombre);

    /**
     * Buscar senderos por estado
     */
    List<Sendero> findByEstado(EstadoGeneral estado);

    /**
     * Buscar senderos activos
     */
    @Query("SELECT s FROM Sendero s WHERE s.estado = 'ACTIVO'")
    List<Sendero> findAllActivos();

    /**
     * Buscar senderos por dificultad
     */
    List<Sendero> findByDificultadAndEstado(Dificultad dificultad, EstadoGeneral estado);

    /**
     * Verificar si existe un sendero con un nombre específico
     */
    boolean existsByNombre(String nombre);

    /**
     * Verificar si existe un sendero con un nombre excluyendo un ID (para updates)
     */
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Sendero s " +
           "WHERE s.nombre = :nombre AND s.idSendero != :id")
    boolean existsByNombreAndIdNot(@Param("nombre") String nombre, @Param("id") Long id);

    /**
     * Calcular cupo disponible para un sendero en una fecha específica
     */
    @Query("SELECT s.cupoMaximoDia - COALESCE(SUM(r.numeroPersonas), 0) " +
           "FROM Sendero s LEFT JOIN s.reservas r " +
           "ON r.fechaVisita = :fecha AND r.estado IN ('PENDIENTE', 'CONFIRMADA') " +
           "WHERE s.idSendero = :senderoId " +
           "GROUP BY s.cupoMaximoDia")
    Integer calcularCupoDisponible(@Param("senderoId") Long senderoId, 
                                    @Param("fecha") LocalDate fecha);

    /**
     * Obtener senderos con disponibilidad en una fecha específica
     */
    @Query("SELECT s FROM Sendero s WHERE s.estado = 'ACTIVO' " +
           "AND s.cupoMaximoDia > (SELECT COALESCE(SUM(r.numeroPersonas), 0) " +
           "FROM Reserva r WHERE r.sendero.idSendero = s.idSendero " +
           "AND r.fechaVisita = :fecha AND r.estado IN ('PENDIENTE', 'CONFIRMADA'))")
    List<Sendero> findSenderosDisponibles(@Param("fecha") LocalDate fecha);

    /**
     * Buscar senderos ordenados por popularidad (más reservas)
     */
    @Query("SELECT s FROM Sendero s WHERE s.estado = 'ACTIVO' " +
           "ORDER BY (SELECT COUNT(r) FROM Reserva r WHERE r.sendero.idSendero = s.idSendero) DESC")
    List<Sendero> findSenderosPopulares();
}
