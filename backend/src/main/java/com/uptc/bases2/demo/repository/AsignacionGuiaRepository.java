package com.uptc.bases2.demo.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uptc.bases2.demo.models.AsignacionGuia;

@Repository
public interface AsignacionGuiaRepository extends JpaRepository<AsignacionGuia, Long> {
    
    @Query("SELECT a FROM AsignacionGuia a WHERE a.reserva.idReserva = :idReserva")
    Optional<AsignacionGuia> findByReservaId(@Param("idReserva") Long idReserva);
    
    @Query("SELECT a FROM AsignacionGuia a WHERE a.guia.idGuia = :idGuia")
    List<AsignacionGuia> findByGuiaId(@Param("idGuia") Long idGuia);
    
    @Query("SELECT a FROM AsignacionGuia a WHERE a.guia.idGuia = :idGuia AND a.reserva.fechaVisita = :fecha")
    List<AsignacionGuia> findByGuiaAndFecha(@Param("idGuia") Long idGuia, @Param("fecha") LocalDate fecha);
    
    @Query("SELECT COUNT(a) FROM AsignacionGuia a WHERE a.guia.idGuia = :idGuia AND a.reserva.fechaVisita = :fecha")
    Long countAsignacionesByGuiaAndFecha(@Param("idGuia") Long idGuia, @Param("fecha") LocalDate fecha);
    
    @Query("SELECT a FROM AsignacionGuia a WHERE a.reserva.fechaVisita = :fecha ORDER BY a.reserva.horaInicio")
    List<AsignacionGuia> findByFecha(@Param("fecha") LocalDate fecha);
    
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM AsignacionGuia a WHERE a.reserva.idReserva = :idReserva")
    boolean existsByReservaId(@Param("idReserva") Long idReserva);
}