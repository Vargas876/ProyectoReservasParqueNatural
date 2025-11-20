package com.uptc.bases2.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uptc.bases2.demo.models.HorarioDisponible;

@Repository
public interface HorarioDisponibleRepository extends JpaRepository<HorarioDisponible, Long> {
    
    // Buscar horarios por sendero
    @Query("SELECT h FROM HorarioDisponible h WHERE h.sendero.idSendero = :idSendero")
    List<HorarioDisponible> findBySenderoId(@Param("idSendero") Long idSendero);
    
    // Buscar horarios por sendero y día
    // ⬇️ CAMBIO: h.diasSemana → h.diaSemana
    @Query("SELECT h FROM HorarioDisponible h WHERE h.sendero.idSendero = :idSendero AND UPPER(h.diaSemana) = UPPER(:dia)")
    List<HorarioDisponible> findBySenderoAndDia(@Param("idSendero") Long idSendero, @Param("dia") String dia);
    
    // Buscar horarios activos por sendero
    @Query("SELECT h FROM HorarioDisponible h WHERE h.sendero.idSendero = :idSendero AND h.estado = 'ACTIVO'")
    List<HorarioDisponible> findActivosBySendero(@Param("idSendero") Long idSendero);
}