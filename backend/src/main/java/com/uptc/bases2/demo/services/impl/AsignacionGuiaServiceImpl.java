package com.uptc.bases2.demo.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uptc.bases2.demo.exceptions.BusinessRuleException;
import com.uptc.bases2.demo.exceptions.ResourceNotFoundException;
import com.uptc.bases2.demo.models.dto.request.AsignacionGuiaRequestDTO;
import com.uptc.bases2.demo.models.dto.request.FinalizarRecorridoDTO;
import com.uptc.bases2.demo.models.dto.request.IniciarRecorridoDTO;
import com.uptc.bases2.demo.models.dto.response.AsignacionResponseDTO;
import com.uptc.bases2.demo.models.dto.response.GuiaResponseDTO;
import com.uptc.bases2.demo.models.dto.response.ReservaResponseDTO;
import com.uptc.bases2.demo.models.entities.AsignacionGuia;
import com.uptc.bases2.demo.models.entities.Guia;
import com.uptc.bases2.demo.models.entities.Reserva;
import com.uptc.bases2.demo.models.enums.EstadoReserva;
import com.uptc.bases2.demo.repositories.AsignacionGuiaRepository;
import com.uptc.bases2.demo.repositories.GuiaRepository;
import com.uptc.bases2.demo.repositories.ReservaRepository;
import com.uptc.bases2.demo.services.interfaces.AsignacionGuiaService;

/**
 * Implementación del servicio de asignación de guías
 */
@Service
@Transactional
public class AsignacionGuiaServiceImpl implements AsignacionGuiaService {

    @Autowired
    private AsignacionGuiaRepository asignacionRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private GuiaRepository guiaRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AsignacionResponseDTO asignarGuia(AsignacionGuiaRequestDTO request) {
        // Validar que la reserva existe
        Reserva reserva = reservaRepository.findById(request.getIdReserva())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", request.getIdReserva()));

        // Validar que la reserva está confirmada
        if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new BusinessRuleException("Solo se pueden asignar guías a reservas CONFIRMADAS");
        }

        // Validar que no tiene guía asignado
        if (asignacionRepository.existsByReservaIdReserva(request.getIdReserva())) {
            throw new BusinessRuleException("La reserva ya tiene un guía asignado");
        }

        // Validar que el guía existe y está activo
        Guia guia = guiaRepository.findById(request.getIdGuia())
                .orElseThrow(() -> new ResourceNotFoundException("Guía", "id", request.getIdGuia()));

        if (!guia.estaActivo()) {
            throw new BusinessRuleException("El guía no está activo");
        }

        // REGLA: Verificar que el guía no tenga más de 2 recorridos ese día
        if (!guiaRepository.puedeTomarRecorrido(request.getIdGuia(), reserva.getFechaVisita())) {
            throw new BusinessRuleException(
                    "El guía ya tiene el máximo de 2 recorridos asignados para esta fecha",
                    "MAX_2_RECORRIDOS_DIA");
        }

        // REGLA: Verificar que el guía puede manejar el número de personas
        if (!guia.puedeTomarRecorrido(reserva.getNumeroPersonas())) {
            throw new BusinessRuleException(
                    String.format("El guía solo puede manejar grupos de hasta %d personas",
                            guia.getMaxPersonasGrupo()),
                    "CAPACIDAD_GUIA_EXCEDIDA");
        }

        // Crear asignación
        AsignacionGuia asignacion = new AsignacionGuia(reserva, guia);
        if (request.getObservaciones() != null) {
            asignacion.setObservacionesGuia(request.getObservaciones());
        }

        asignacion = asignacionRepository.save(asignacion);

        return convertirAResponseDTO(asignacion);
    }

    @Override
    @Transactional(readOnly = true)
    public AsignacionResponseDTO obtenerPorId(Long id) {
        AsignacionGuia asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación", "id", id));

        return convertirAResponseDTO(asignacion);
    }

    @Override
    @Transactional(readOnly = true)
    public AsignacionResponseDTO obtenerPorReserva(Long reservaId) {
        AsignacionGuia asignacion = asignacionRepository.findByReservaIdReserva(reservaId)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación", "reservaId", reservaId));

        return convertirAResponseDTO(asignacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionResponseDTO> obtenerPorGuia(Long guiaId) {
        return asignacionRepository.findByGuiaId(guiaId).stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void iniciarRecorrido(IniciarRecorridoDTO request) {
        AsignacionGuia asignacion = asignacionRepository.findById(request.getIdAsignacion())
                .orElseThrow(() -> new ResourceNotFoundException("Asignación", "id", request.getIdAsignacion()));

        if (asignacion.getHoraInicioReal() != null) {
            throw new BusinessRuleException("El recorrido ya fue iniciado");
        }

        asignacion.iniciarRecorrido();

        if (request.getObservacionesInicio() != null) {
            asignacion.setObservacionesGuia(request.getObservacionesInicio());
        }

        asignacionRepository.save(asignacion);
    }

    @Override
    public void finalizarRecorrido(FinalizarRecorridoDTO request) {
        AsignacionGuia asignacion = asignacionRepository.findById(request.getIdAsignacion())
                .orElseThrow(() -> new ResourceNotFoundException("Asignación", "id", request.getIdAsignacion()));

        if (asignacion.getHoraInicioReal() == null) {
            throw new BusinessRuleException("El recorrido no ha sido iniciado");
        }

        if (asignacion.getHoraFinReal() != null) {
            throw new BusinessRuleException("El recorrido ya fue finalizado");
        }

        asignacion.finalizarRecorrido(request.getObservacionesGuia());

        if (request.getHuboIncidencias()) {
            asignacion.setIncidencias(true);
            asignacion.setDescripcionIncidencias(request.getDescripcionIncidencias());
        }

        asignacionRepository.save(asignacion);

        // Marcar reserva como completada
        Reserva reserva = asignacion.getReserva();
        reserva.completar();
        reservaRepository.save(reserva);

        // Incrementar contador de recorridos del guía
        Guia guia = asignacion.getGuia();
        guia.incrementarRecorridos();
        guiaRepository.save(guia);
    }

    @Override
    public void reasignarGuia(Long asignacionId, Long nuevoGuiaId) {
        AsignacionGuia asignacion = asignacionRepository.findById(asignacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación", "id", asignacionId));

        if (asignacion.getHoraInicioReal() != null) {
            throw new BusinessRuleException("No se puede reasignar un recorrido ya iniciado");
        }

        Guia nuevoGuia = guiaRepository.findById(nuevoGuiaId)
                .orElseThrow(() -> new ResourceNotFoundException("Guía", "id", nuevoGuiaId));

        if (!nuevoGuia.estaActivo()) {
            throw new BusinessRuleException("El nuevo guía no está activo");
        }

        // Validar reglas de negocio para el nuevo guía
        if (!guiaRepository.puedeTomarRecorrido(nuevoGuiaId, asignacion.getReserva().getFechaVisita())) {
            throw new BusinessRuleException("El nuevo guía ya tiene el máximo de recorridos para esta fecha");
        }

        asignacion.setGuia(nuevoGuia);
        asignacionRepository.save(asignacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionResponseDTO> obtenerAsignacionesActivas() {
        return asignacionRepository.findAsignacionesActivas().stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    private AsignacionResponseDTO convertirAResponseDTO(AsignacionGuia asignacion) {
        AsignacionResponseDTO dto = new AsignacionResponseDTO();

        dto.setIdAsignacion(asignacion.getIdAsignacion());
        dto.setIdReserva(asignacion.getReserva().getIdReserva());
        dto.setGuia(modelMapper.map(asignacion.getGuia(), GuiaResponseDTO.class));
        dto.setReserva(modelMapper.map(asignacion.getReserva(), ReservaResponseDTO.class)); // AGREGADO
        dto.setFechaAsignacion(asignacion.getFechaAsignacion());
        dto.setHoraInicioReal(asignacion.getHoraInicioReal());
        dto.setHoraFinReal(asignacion.getHoraFinReal());
        dto.setObservacionesGuia(asignacion.getObservacionesGuia());
        dto.setCalificacionVisitante(asignacion.getCalificacionVisitante());
        dto.setComentarioVisitante(asignacion.getComentarioVisitante());
        dto.setIncidencias(asignacion.getIncidencias());
        dto.setDescripcionIncidencias(asignacion.getDescripcionIncidencias());
        dto.setDuracionMinutos(asignacion.getDuracionMinutos());

        return dto;
    }
}
