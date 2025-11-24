package com.uptc.bases2.demo.services.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uptc.bases2.demo.exceptions.ConflictException;
import com.uptc.bases2.demo.exceptions.ResourceNotFoundException;
import com.uptc.bases2.demo.models.dto.request.GuiaRequestDTO;
import com.uptc.bases2.demo.models.dto.response.AgendaGuiaResponseDTO;
import com.uptc.bases2.demo.models.dto.response.AsignacionResponseDTO;
import com.uptc.bases2.demo.models.dto.response.GuiaResponseDTO;
import com.uptc.bases2.demo.models.dto.response.ReservaResponseDTO;
import com.uptc.bases2.demo.models.entities.AsignacionGuia;
import com.uptc.bases2.demo.models.entities.Guia;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import com.uptc.bases2.demo.repositories.AsignacionGuiaRepository;
import com.uptc.bases2.demo.repositories.GuiaRepository;
import com.uptc.bases2.demo.services.interfaces.GuiaService;

/**
 * Implementación del servicio de guías
 */
@Service
@Transactional
public class GuiaServiceImpl implements GuiaService {

    @Autowired
    private GuiaRepository guiaRepository;

    @Autowired
    private AsignacionGuiaRepository asignacionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public GuiaResponseDTO crear(GuiaRequestDTO request) {
        // Validar email único
        if (guiaRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("El email ya está registrado");
        }

        // Validar cédula única
        if (guiaRepository.findByCedula(request.getCedula()).isPresent()) {
            throw new ConflictException("La cédula ya está registrada");
        }

        Guia guia = new Guia(
                request.getCedula(),
                request.getNombre(),
                request.getApellido(),
                request.getTelefono(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getEspecialidades());

        if (request.getMaxPersonasGrupo() != null) {
            guia.setMaxPersonasGrupo(request.getMaxPersonasGrupo());
        }

        guia = guiaRepository.save(guia);
        return modelMapper.map(guia, GuiaResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public GuiaResponseDTO obtenerPorId(Long id) {
        Guia guia = guiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guía", "id", id));

        return modelMapper.map(guia, GuiaResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public GuiaResponseDTO obtenerPorEmail(String email) {
        Guia guia = guiaRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Guía", "email", email));

        return modelMapper.map(guia, GuiaResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuiaResponseDTO> obtenerTodos() {
        return guiaRepository.findAll().stream()
                .map(guia -> modelMapper.map(guia, GuiaResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuiaResponseDTO> obtenerActivos() {
        return guiaRepository.findAllActivos().stream()
                .map(guia -> modelMapper.map(guia, GuiaResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuiaResponseDTO> obtenerDisponiblesPorFecha(LocalDate fecha) {
        return guiaRepository.findGuiasDisponiblesPorFecha(fecha).stream()
                .map(guia -> modelMapper.map(guia, GuiaResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public GuiaResponseDTO actualizar(Long id, GuiaRequestDTO request) {
        Guia guia = guiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guía", "id", id));

        // Validar email único
        if (guiaRepository.findByEmail(request.getEmail()).isPresent()) {
            Guia existente = guiaRepository.findByEmail(request.getEmail()).get();
            if (!existente.getId().equals(id)) {
                throw new ConflictException("El email ya está en uso");
            }
        }

        guia.setNombre(request.getNombre());
        guia.setApellido(request.getApellido());
        guia.setTelefono(request.getTelefono());
        guia.setEmail(request.getEmail());
        guia.setEspecialidades(request.getEspecialidades());

        if (request.getMaxPersonasGrupo() != null) {
            guia.setMaxPersonasGrupo(request.getMaxPersonasGrupo());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            guia.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        guia = guiaRepository.save(guia);
        return modelMapper.map(guia, GuiaResponseDTO.class);
    }

    @Override
    public void cambiarEstado(Long id, String nuevoEstado) {
        Guia guia = guiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guía", "id", id));

        guia.setEstado(EstadoGeneral.fromString(nuevoEstado));
        guiaRepository.save(guia);
    }

    @Override
    public void eliminar(Long id) {
        Guia guia = guiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guía", "id", id));

        guia.setEstado(EstadoGeneral.ELIMINADO);
        guiaRepository.save(guia);
    }

    @Override
    @Transactional(readOnly = true)
    public AgendaGuiaResponseDTO obtenerAgenda(Long guiaId, LocalDate fecha) {
        // Validar que el guía existe
        Guia guia = guiaRepository.findById(guiaId)
                .orElseThrow(() -> new ResourceNotFoundException(" Guía", "id", guiaId));

        // Obtener asignaciones para la fecha especificada
        List<AsignacionGuia> asignaciones = asignacionRepository.findByGuiaIdAndFecha(guiaId, fecha);

        // Convertir a DTOs usando el mismo converter que ya tiene toda la info
        List<AsignacionResponseDTO> recorridosDTOs = asignaciones.stream()
                .map(this::convertirAsignacionAResponseDTO)
                .collect(Collectors.toList());

        // Crear respuesta de agenda
        AgendaGuiaResponseDTO agenda = new AgendaGuiaResponseDTO();
        agenda.setFecha(fecha);
        agenda.setRecorridos(recorridosDTOs); // Ahora es List<AsignacionResponseDTO>
        agenda.setTotalRecorridos(recorridosDTOs.size());

        long pendientes = asignaciones.stream()
                .filter(a -> !a.estaFinalizado())
                .count();
        agenda.setRecorridosPendientes((int) pendientes);

        long completados = asignaciones.stream()
                .filter(AsignacionGuia::estaFinalizado)
                .count();
        agenda.setRecorridosCompletados((int) completados);

        return agenda;
    }

    // Método helper para convertir AsignacionGuia a AsignacionResponseDTO
    private AsignacionResponseDTO convertirAsignacionAResponseDTO(AsignacionGuia asignacion) {
        AsignacionResponseDTO dto = new AsignacionResponseDTO();

        dto.setIdAsignacion(asignacion.getIdAsignacion());
        dto.setIdReserva(asignacion.getReserva().getIdReserva());
        dto.setGuia(modelMapper.map(asignacion.getGuia(), GuiaResponseDTO.class));
        dto.setReserva(modelMapper.map(asignacion.getReserva(), ReservaResponseDTO.class));
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

    @Override
    @Transactional(readOnly = true)
    public boolean puedeTomarRecorrido(Long guiaId, LocalDate fecha) {
        return guiaRepository.puedeTomarRecorrido(guiaId, fecha);
    }
}
