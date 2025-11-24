package com.uptc.bases2.demo.repositories;

import com.uptc.bases2.demo.models.entities.Visitante;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para la entidad Visitante
 */
@Repository
public interface VisitanteRepository extends JpaRepository<Visitante, Long> {

    /**
     * Buscar visitante por email
     */
    Optional<Visitante> findByEmail(String email);

    /**
     * Buscar visitante por cédula
     */
    Optional<Visitante> findByCedula(String cedula);

    /**
     * Buscar visitantes por estado
     */
    List<Visitante> findByEstado(EstadoGeneral estado);

    /**
     * Buscar visitantes activos
     */
    @Query("SELECT v FROM Visitante v WHERE v.estado = 'ACTIVO'")
    List<Visitante> findAllActivos();

    /**
     * Contar reservas activas de un visitante
     */
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.visitante.id = :visitanteId " +
           "AND r.estado IN ('PENDIENTE', 'CONFIRMADA')")
    long contarReservasActivas(@Param("visitanteId") Long visitanteId);

    /**
     * Verificar si un visitante puede hacer más reservas (máximo 2 activas)
     */
    @Query("SELECT CASE WHEN COUNT(r) < 2 THEN true ELSE false END FROM Reserva r " +
           "WHERE r.visitante.id = :visitanteId " +
           "AND r.estado IN ('PENDIENTE', 'CONFIRMADA')")
    boolean puedeHacerReserva(@Param("visitanteId") Long visitanteId);

    /**
     * Obtener top visitantes por número de visitas
     */
    @Query("SELECT v FROM Visitante v WHERE v.estado = 'ACTIVO' " +
           "ORDER BY v.numeroVisitas DESC")
    List<Visitante> findTopVisitantes();
}
