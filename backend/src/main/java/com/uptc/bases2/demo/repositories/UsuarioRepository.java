package com.uptc.bases2.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uptc.bases2.demo.models.entities.Usuario;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;

/**
 * Repository para la entidad Usuario (base)
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

       /**
        * Buscar usuario por email
        */
       Optional<Usuario> findByEmail(String email);

       /**
        * Buscar usuario por email y estado
        */
       Optional<Usuario> findByEmailAndEstado(String email, EstadoGeneral estado);

       /**
        * Buscar usuario por ID y estado
        */
       Optional<Usuario> findByIdAndEstado(Long id, EstadoGeneral estado);

       /**
        * Buscar usuario por cédula
        */
       Optional<Usuario> findByCedula(String cedula);

       /**
        * Verificar si existe un email
        */
       boolean existsByEmail(String email);

       /**
        * Verificar si existe una cédula
        */
       boolean existsByCedula(String cedula);

       /**
        * Verificar si existe un email excluyendo un ID específico (para updates)
        */
       @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u " +
                     "WHERE u.email = :email AND u.id != :id")
       boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);

       /**
        * Verificar si existe una cédula excluyendo un ID específico (para updates)
        */
       @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u " +
                     "WHERE u.cedula = :cedula AND u.id != :id")
       boolean existsByCedulaAndIdNot(@Param("cedula") String cedula, @Param("id") Long id);
}
