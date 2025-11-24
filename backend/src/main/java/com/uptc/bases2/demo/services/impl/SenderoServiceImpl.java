package com.uptc.bases2.demo.services.impl;

import com.uptc.bases2.demo.exceptions.ConflictException;
import com.uptc.bases2.demo.exceptions.ResourceNotFoundException;
import com.uptc.bases2.demo.models.dto.request.SenderoRequestDTO;
import com.uptc.bases2.demo.models.dto.response.SenderoResponseDTO;
import com.uptc.bases2.demo.models.entities.Sendero;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import com.uptc.bases2.demo.repositories.SenderoRepository;
import com.uptc.bases2.demo.services.interfaces.SenderoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de senderos
 */
@Service
@Transactional
public class SenderoServiceImpl implements SenderoService {

    @Autowired
    private SenderoRepository senderoRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public SenderoResponseDTO crear(SenderoRequestDTO request) {
        // Validar nombre único
        if (senderoRepository.existsByNombre(request.getNombre())) {
            throw new ConflictException("Ya existe un sendero con ese nombre");
        }

        Sendero sendero = modelMapper.map(request, Sendero.class);
        sendero = senderoRepository.save(sendero);
        
        return modelMapper.map(sendero, SenderoResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public SenderoResponseDTO obtenerPorId(Long id) {
        Sendero sendero = senderoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sendero", "id", id));
        
        return modelMapper.map(sendero, SenderoResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SenderoResponseDTO> obtenerTodos() {
        return senderoRepository.findAll().stream()
            .map(sendero -> modelMapper.map(sendero, SenderoResponseDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SenderoResponseDTO> obtenerActivos() {
        return senderoRepository.findAllActivos().stream()
            .map(sendero -> modelMapper.map(sendero, SenderoResponseDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SenderoResponseDTO> obtenerDisponibles(LocalDate fecha) {
        return senderoRepository.findSenderosDisponibles(fecha).stream()
            .map(sendero -> modelMapper.map(sendero, SenderoResponseDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    public SenderoResponseDTO actualizar(Long id, SenderoRequestDTO request) {
        Sendero sendero = senderoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sendero", "id", id));

        // Validar nombre único
        if (senderoRepository.existsByNombreAndIdNot(request.getNombre(), id)) {
            throw new ConflictException("Ya existe otro sendero con ese nombre");
        }

        sendero.setNombre(request.getNombre());
        sendero.setDescripcion(request.getDescripcion());
        sendero.setDificultad(request.getDificultad());
        sendero.setDuracionHoras(request.getDuracionHoras());
        sendero.setCupoMaximoDia(request.getCupoMaximoDia());
        sendero.setDistanciaKm(request.getDistanciaKm());
        sendero.setImagenUrl(request.getImagenUrl());

        sendero = senderoRepository.save(sendero);
        return modelMapper.map(sendero, SenderoResponseDTO.class);
    }

    @Override
    public void cambiarEstado(Long id, String nuevoEstado) {
        Sendero sendero = senderoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sendero", "id", id));

        sendero.setEstado(EstadoGeneral.fromString(nuevoEstado));
        senderoRepository.save(sendero);
    }

    @Override
    public void eliminar(Long id) {
        Sendero sendero = senderoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sendero", "id", id));

        sendero.setEstado(EstadoGeneral.ELIMINADO);
        senderoRepository.save(sendero);
    }

    @Override
    @Transactional(readOnly = true)
    public Integer calcularCupoDisponible(Long senderoId, LocalDate fecha) {
        Integer cupo = senderoRepository.calcularCupoDisponible(senderoId, fecha);
        return cupo != null ? cupo : 0;
    }
}
