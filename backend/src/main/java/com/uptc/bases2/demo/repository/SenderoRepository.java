package com.uptc.bases2.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uptc.bases2.demo.models.Sendero;

@Repository
public interface SenderoRepository extends JpaRepository<Sendero, Long> {
    
    @Query("SELECT s FROM Sendero s WHERE s.estado = :estado")
    List<Sendero> findByEstado(@Param("estado") String estado);
    
    @Query("SELECT s FROM Sendero s WHERE s.dificultad = :dificultad")
    List<Sendero> findByDificultad(@Param("dificultad") String dificultad);
    
    @Query("SELECT s FROM Sendero s WHERE s.estado = :estado AND s.dificultad = :dificultad")
    List<Sendero> findByEstadoAndDificultad(@Param("estado") String estado, @Param("dificultad") String dificultad);
    
    @Query("SELECT s FROM Sendero s WHERE s.estado = 'ACTIVO' ORDER BY s.nombre")
    List<Sendero> findAllActivos();
}