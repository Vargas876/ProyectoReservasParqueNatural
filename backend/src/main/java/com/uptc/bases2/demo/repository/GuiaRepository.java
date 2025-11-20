package com.uptc.bases2.demo.repository;

import com.uptc.bases2.demo.models.Guia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GuiaRepository extends JpaRepository<Guia, Long> {

    Optional<Guia> findByCedula(String cedula);
    
    List<Guia> findByEstado(String estado);
    
    @Query("SELECT g FROM Guia g WHERE g.estado = 'ACTIVO'")
    List<Guia> findAllActivos();
    
    // CAMBIADO: especialidad → especialidades
    List<Guia> findByEspecialidades(String especialidades);
    
    boolean existsByCedula(String cedula);
    
    @Query("SELECT DISTINCT g FROM Guia g " +
           "WHERE g.estado = 'ACTIVO' " +
           "AND g.idGuia NOT IN (" +
           "    SELECT a.guia.idGuia FROM AsignacionGuia a " +
           "    WHERE a.reserva.fechaVisita = :fecha " +
           "    AND a.reserva.horaInicio = :hora " +
           "    AND a.reserva.estado IN ('PENDIENTE', 'CONFIRMADA')" +
           ")")
    List<Guia> findGuiasDisponibles(@Param("fecha") LocalDate fecha, @Param("hora") String hora);
}
