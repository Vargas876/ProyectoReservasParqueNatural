package com.uptc.bases2.demo.services.impl;

import com.uptc.bases2.demo.exceptions.BadRequestException;
import com.uptc.bases2.demo.exceptions.BusinessRuleException;
import com.uptc.bases2.demo.exceptions.ResourceNotFoundException;
import com.uptc.bases2.demo.models.dto.request.ReservaRequestDTO;
import com.uptc.bases2.demo.models.dto.request.ReservaUpdateDTO;
import com.uptc.bases2.demo.models.dto.response.ReservaResponseDTO;
import com.uptc.bases2.demo.models.dto.response.SenderoResponseDTO;
import com.uptc.bases2.demo.models.dto.response.VisitanteResponseDTO;
import com.uptc.bases2.demo.models.entities.Reserva;
import com.uptc.bases2.demo.models.entities.Sendero;
import com.uptc.bases2.demo.models.entities.Visitante;
import com.uptc.bases2.demo.models.enums.EstadoReserva;
import com.uptc.bases2.demo.repositories.ReservaRepository;
import com.uptc.bases2.demo.repositories.SenderoRepository;
import com.uptc.bases2.demo.repositories.VisitanteRepository;
import com.uptc.bases2.demo.services.interfaces.ReservaService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de reservas
 * Incluye todas las validaciones de reglas de negocio
 */
@Service
@Transactional
public class ReservaServiceImpl implements ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private VisitanteRepository visitanteRepository;

    @Autowired
    private SenderoRepository senderoRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ReservaResponseDTO crear(Long visitanteId, ReservaRequestDTO request) {
        // 1. Validar que el visitante existe y está activo
        Visitante visitante = visitanteRepository.findById(visitanteId)
            .orElseThrow(() -> new ResourceNotFoundException("Visitante", "id", visitanteId));

        if (!visitante.estaActivo()) {
            throw new BusinessRuleException("El visitante no está activo");
        }

        // 2. Validar que el sendero existe y está activo
        Sendero sendero = senderoRepository.findById(request.getIdSendero())
            .orElseThrow(() -> new ResourceNotFoundException("Sendero", "id", request.getIdSendero()));

        if (!sendero.estaDisponible()) {
            throw new BusinessRuleException("El sendero no está disponible");
        }

        // 3. REGLA: Reserva con mínimo 24 horas de anticipación
        long horasAnticipacion = ChronoUnit.HOURS.between(LocalDate.now().atStartOfDay(), 
                                                           request.getFechaVisita().atStartOfDay());
        if (horasAnticipacion < 24) {
            throw new BusinessRuleException(
                "La reserva debe realizarse con al menos 24 horas de anticipación",
                "MIN_24H_ANTICIPACION"
            );
        }

        // 4. REGLA: Máximo 2 reservas activas por visitante
        if (!visitanteRepository.puedeHacerReserva(visitanteId)) {
            throw new BusinessRuleException(
                "Ya tiene el máximo de 2 reservas activas. Cancele o complete una antes de crear otra",
                "MAX_2_RESERVAS_ACTIVAS"
            );
        }

        // 5. REGLA: Verificar cupo disponible
        if (!reservaRepository.verificarDisponibilidad(
                request.getIdSendero(), 
                request.getFechaVisita(), 
                request.getNumeroPersonas())) {
            throw new BusinessRuleException(
                "No hay cupo disponible para el número de personas solicitado en esta fecha",
                "CUPO_INSUFICIENTE"
            );
        }

        // 6. Verificar conflicto de horario para el mismo visitante
        if (reservaRepository.existeConflictoHorario(
                visitanteId, 
                request.getFechaVisita(), 
                request.getHoraInicio())) {
            throw new BusinessRuleException(
                "Ya tiene una reserva en este horario para la misma fecha",
                "CONFLICTO_HORARIO"
            );
        }

        // 7. Crear la reserva
        Reserva reserva = new Reserva();
        reserva.setVisitante(visitante);
        reserva.setSendero(sendero);
        reserva.setFechaVisita(request.getFechaVisita());
        reserva.setNumeroPersonas(request.getNumeroPersonas());
        reserva.setHoraInicio(request.getHoraInicio());
        reserva.setObservaciones(request.getObservaciones());
        reserva.setEstado(EstadoReserva.PENDIENTE);

        reserva = reservaRepository.save(reserva);

        return convertirAResponseDTO(reserva);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservaResponseDTO obtenerPorId(Long id) {
        Reserva reserva = reservaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", id));
        
        return convertirAResponseDTO(reserva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> obtenerPorVisitante(Long visitanteId) {
        return reservaRepository.findByVisitanteId(visitanteId).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> obtenerReservasActivas(Long visitanteId) {
        return reservaRepository.findReservasActivasByVisitante(visitanteId).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> obtenerPorSendero(Long senderoId) {
        return reservaRepository.findBySenderoIdSendero(senderoId).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> obtenerPorFecha(LocalDate fecha) {
        return reservaRepository.findByFechaVisita(fecha).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> obtenerTodas() {
        return reservaRepository.findAll().stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public ReservaResponseDTO modificar(Long reservaId, ReservaUpdateDTO request) {
        Reserva reserva = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", reservaId));

        // Validar que la reserva puede ser modificada
        if (!reserva.puedeModificarse()) {
            throw new BusinessRuleException(
                "Solo se pueden modificar reservas en estado PENDIENTE o CONFIRMADA",
                "ESTADO_NO_MODIFICABLE"
            );
        }

        // Si cambia la fecha, validar anticipación de 24h
        if (request.getFechaVisita() != null && !request.getFechaVisita().equals(reserva.getFechaVisita())) {
            long horasAnticipacion = ChronoUnit.HOURS.between(
                LocalDate.now().atStartOfDay(), 
                request.getFechaVisita().atStartOfDay()
            );
            if (horasAnticipacion < 24) {
                throw new BusinessRuleException(
                    "La nueva fecha debe ser con al menos 24 horas de anticipación",
                    "MIN_24H_ANTICIPACION"
                );
            }
            reserva.setFechaVisita(request.getFechaVisita());
        }

        // Si cambia el número de personas, validar cupo
        if (request.getNumeroPersonas() != null && 
            !request.getNumeroPersonas().equals(reserva.getNumeroPersonas())) {
            
            LocalDate fechaValidar = request.getFechaVisita() != null ? 
                request.getFechaVisita() : reserva.getFechaVisita();
            
            if (!reservaRepository.verificarDisponibilidad(
                    reserva.getSendero().getIdSendero(), 
                    fechaValidar, 
                    request.getNumeroPersonas())) {
                throw new BusinessRuleException(
                    "No hay cupo disponible para el nuevo número de personas",
                    "CUPO_INSUFICIENTE"
                );
            }
            reserva.setNumeroPersonas(request.getNumeroPersonas());
        }

        if (request.getHoraInicio() != null) {
            reserva.setHoraInicio(request.getHoraInicio());
        }

        if (request.getObservaciones() != null) {
            reserva.setObservaciones(request.getObservaciones());
        }

        reserva = reservaRepository.save(reserva);
        return convertirAResponseDTO(reserva);
    }

    @Override
    public void cancelar(Long reservaId, String motivo) {
        Reserva reserva = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", reservaId));

        if (!reserva.puedeCancelarse()) {
            throw new BusinessRuleException(
                "Esta reserva no puede ser cancelada",
                "NO_CANCELABLE"
            );
        }

        reserva.cancelar(motivo);
        reservaRepository.save(reserva);
    }

    @Override
    public void confirmar(Long reservaId) {
        Reserva reserva = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", reservaId));

        if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
            throw new BusinessRuleException("Solo se pueden confirmar reservas en estado PENDIENTE");
        }

        reserva.confirmar();
        reservaRepository.save(reserva);
    }

    @Override
    public void completar(Long reservaId) {
        Reserva reserva = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", reservaId));

        if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new BusinessRuleException("Solo se pueden completar reservas en estado CONFIRMADA");
        }

        reserva.completar();
        reservaRepository.save(reserva);

        // Incrementar contador de visitas del visitante
        Visitante visitante = reserva.getVisitante();
        visitante.incrementarVisitas();
        visitanteRepository.save(visitante);
    }

    @Override
    public void marcarNoAsistio(Long reservaId) {
        Reserva reserva = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", reservaId));

        if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new BusinessRuleException("Solo se pueden marcar como 'No Asistió' reservas CONFIRMADAS");
        }

        reserva.marcarNoAsistio();
        reservaRepository.save(reserva);
    }

    /**
     * Método auxiliar para convertir Reserva a ReservaResponseDTO
     */
    private ReservaResponseDTO convertirAResponseDTO(Reserva reserva) {
        ReservaResponseDTO dto = new ReservaResponseDTO();
        
        dto.setIdReserva(reserva.getIdReserva());
        dto.setFechaReserva(reserva.getFechaReserva());
        dto.setFechaVisita(reserva.getFechaVisita());
        dto.setNumeroPersonas(reserva.getNumeroPersonas());
        dto.setHoraInicio(reserva.getHoraInicio());
        dto.setEstado(reserva.getEstado());
        dto.setObservaciones(reserva.getObservaciones());
        dto.setFechaCreacion(reserva.getFechaCreacion());
        dto.setFechaModificacion(reserva.getFechaModificacion());
        dto.setFechaCancelacion(reserva.getFechaCancelacion());
        dto.setMotivoCancelacion(reserva.getMotivoCancelacion());
        
        // Mapear visitante
        dto.setVisitante(modelMapper.map(reserva.getVisitante(), VisitanteResponseDTO.class));
        
        // Mapear sendero
        dto.setSendero(modelMapper.map(reserva.getSendero(), SenderoResponseDTO.class));
        
        // Información de guía asignado
        dto.setTieneGuiaAsignado(reserva.tieneGuiaAsignado());
        if (reserva.getAsignacionGuia() != null) {
            dto.setGuiaAsignado(modelMapper.map(
                reserva.getAsignacionGuia().getGuia(), 
                com.uptc.bases2.demo.models.dto.response.GuiaResponseDTO.class
            ));
        }
        
        return dto;
    }
}
