package com.uptc.bases2.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uptc.bases2.demo.models.Visitante;

@Repository
public interface VisitanteRepository extends JpaRepository<Visitante, Long> {
    
    @Query("SELECT v FROM Visitante v WHERE v.cedula = :cedula")
    Optional<Visitante> findByCedula(@Param("cedula") String cedula);
    
    @Query("SELECT v FROM Visitante v WHERE v.email = :email")
    Optional<Visitante> findByEmail(@Param("email") String email);
    
    @Query("SELECT v FROM Visitante v WHERE v.estado = :estado")
    List<Visitante> findByEstado(@Param("estado") String estado);
    
    @Query("SELECT CASE WHEN COUNT(v) > 0 THEN true ELSE false END FROM Visitante v WHERE v.cedula = :cedula")
    boolean existsByCedula(@Param("cedula") String cedula);
    
    @Query("SELECT CASE WHEN COUNT(v) > 0 THEN true ELSE false END FROM Visitante v WHERE v.email = :email")
    boolean existsByEmail(@Param("email") String email);
}