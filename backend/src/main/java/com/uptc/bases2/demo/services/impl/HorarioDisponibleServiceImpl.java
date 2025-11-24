package com.uptc.bases2.demo.services.impl;

import com.uptc.bases2.demo.exceptions.BusinessRuleException;
import com.uptc.bases2.demo.exceptions.ResourceNotFoundException;
import com.uptc.bases2.demo.models.dto.request.HorarioRequestDTO;
import com.uptc.bases2.demo.models.dto.response.HorarioResponseDTO;
import com.uptc.bases2.demo.models.entities.HorarioDisponible;
import com.uptc.bases2.demo.models.entities.Sendero;
import com.uptc.bases2.demo.repositories.HorarioDisponibleRepository;
import com.uptc.bases2.demo.repositories.SenderoRepository;
import com.uptc.bases2.demo.services.interfaces.HorarioDisponibleService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de horarios disponibles
 */
@Service
@Transactional
public class HorarioDisponibleServiceImpl implements HorarioDisponibleService {

    @Autowired
    private HorarioDisponibleRepository horarioRepository;

    @Autowired
    private SenderoRepository senderoRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public HorarioResponseDTO crear(HorarioRequestDTO request) {
        // Validar que el sendero existe
        Sendero sendero = senderoRepository.findById(request.getIdSendero())
            .orElseThrow(() -> new ResourceNotFoundException("Sendero", "id", request.getIdSendero()));

        // Validar que hora inicio es anterior a hora fin
        if (!request.getHoraInicio().isBefore(request.getHoraFin())) {
            throw new BusinessRuleException("La hora de inicio debe ser anterior a la hora de fin");
        }

        // Validar que no exista solapamiento con otros horarios del mismo sendero
        if (horarioRepository.existeSolapamiento(
                request.getIdSendero(), 
                request.getHoraInicio(), 
                request.getHoraFin())) {
            throw new BusinessRuleException(
                "El horario se solapa con otro horario existente del sendero",
                "HORARIO_SOLAPADO"
            );
        }

        // Crear horario
        HorarioDisponible horario = new HorarioDisponible();
        horario.setSendero(sendero);
        horario.setHoraInicio(request.getHoraInicio());
        horario.setHoraFin(request.getHoraFin());
        horario.setCupoHorario(request.getCupoHorario());
        
        if (request.getDiasSemana() != null) {
            horario.setDiasSemana(request.getDiasSemana());
        }

        horario = horarioRepository.save(horario);

        return convertirAResponseDTO(horario);
    }

    @Override
    @Transactional(readOnly = true)
    public HorarioResponseDTO obtenerPorId(Long id) {
        HorarioDisponible horario = horarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Horario", "id", id));
        
        return convertirAResponseDTO(horario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HorarioResponseDTO> obtenerPorSendero(Long senderoId) {
        return horarioRepository.findBySenderoIdSendero(senderoId).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HorarioResponseDTO> obtenerActivosPorSendero(Long senderoId) {
        return horarioRepository.findHorariosActivosBySendero(senderoId).stream()
            .map(this::convertirAResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public HorarioResponseDTO actualizar(Long id, HorarioRequestDTO request) {
        HorarioDisponible horario = horarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Horario", "id", id));

        // Validar que hora inicio es anterior a hora fin
        if (!request.getHoraInicio().isBefore(request.getHoraFin())) {
            throw new BusinessRuleException("La hora de inicio debe ser anterior a la hora de fin");
        }

        // Actualizar datos
        horario.setHoraInicio(request.getHoraInicio());
        horario.setHoraFin(request.getHoraFin());
        horario.setCupoHorario(request.getCupoHorario());
        
        if (request.getDiasSemana() != null) {
            horario.setDiasSemana(request.getDiasSemana());
        }

        horario = horarioRepository.save(horario);

        return convertirAResponseDTO(horario);
    }

    @Override
    public void activar(Long id) {
        HorarioDisponible horario = horarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Horario", "id", id));

        horario.setActivo(true);
        horarioRepository.save(horario);
    }

    @Override
    public void desactivar(Long id) {
        HorarioDisponible horario = horarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Horario", "id", id));

        horario.setActivo(false);
        horarioRepository.save(horario);
    }

    @Override
    public void eliminar(Long id) {
        HorarioDisponible horario = horarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Horario", "id", id));

        // Desactivar en lugar de eliminar físicamente
        horario.setActivo(false);
        horarioRepository.save(horario);
    }

    private HorarioResponseDTO convertirAResponseDTO(HorarioDisponible horario) {
        HorarioResponseDTO dto = new HorarioResponseDTO();
        
        dto.setIdHorario(horario.getIdHorario());
        dto.setIdSendero(horario.getSendero().getIdSendero());
        dto.setNombreSendero(horario.getSendero().getNombre());
        dto.setHoraInicio(horario.getHoraInicio());
        dto.setHoraFin(horario.getHoraFin());
        dto.setCupoHorario(horario.getCupoHorario());
        dto.setDiasSemana(horario.getDiasSemana());
        dto.setActivo(horario.getActivo());
        dto.setDuracionMinutos(horario.getDuracionMinutos());
        
        return dto;
    }
}
