package com.uptc.bases2.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uptc.bases2.demo.models.Guia;

@Repository
public interface GuiaRepository extends JpaRepository<Guia, Long> {
    
    @Query("SELECT g FROM Guia g WHERE g.cedula = :cedula")
    Optional<Guia> findByCedula(@Param("cedula") String cedula);
    
    @Query("SELECT g FROM Guia g WHERE g.estado = :estado")
    List<Guia> findByEstado(@Param("estado") String estado);
    
    @Query("SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END FROM Guia g WHERE g.cedula = :cedula")
    boolean existsByCedula(@Param("cedula") String cedula);
    
    @Query("SELECT g FROM Guia g WHERE g.estado = 'ACTIVO' ORDER BY g.nombre")
    List<Guia> findAllActivos();
    
    @Query("SELECT g FROM Guia g WHERE g.especialidades LIKE %:especialidad% AND g.estado = 'ACTIVO'")
    List<Guia> findByEspecialidad(@Param("especialidad") String especialidad);
}