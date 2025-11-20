package com.uptc.bases2.demo.controllers;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// AGREGAR ESTOS IMPORTS ⬇️
import com.uptc.bases2.demo.models.AsignacionGuia;
import com.uptc.bases2.demo.models.Guia;
import com.uptc.bases2.demo.models.Reserva;
import com.uptc.bases2.demo.models.Sendero;
import com.uptc.bases2.demo.models.Visitante;
import com.uptc.bases2.demo.services.AsignacionGuiaService;
import com.uptc.bases2.demo.services.GuiaService;
import com.uptc.bases2.demo.services.ReservaService;
import com.uptc.bases2.demo.services.SenderoService;
import com.uptc.bases2.demo.services.VisitanteService;

@RestController
@RequestMapping("/reserva")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;
    
    // AGREGAR ESTOS @Autowired ⬇️
    @Autowired
    private VisitanteService visitanteService;
    
    @Autowired
    private SenderoService senderoService;
    
    @Autowired
    private GuiaService guiaService;
    
    @Autowired
    private AsignacionGuiaService asignacionGuiaService;
    
    @GetMapping("/findAll")
    public List<Reserva> getAllReservas() {
        return reservaService.findAll();
    }

    @PostMapping("/save")
    public ResponseEntity<?> createReserva(@RequestBody Reserva reserva) {
        try {
            Reserva nuevaReserva = reservaService.save(reserva);
            return ResponseEntity.ok(nuevaReserva);
        } catch (JpaSystemException e) {
            if (e.getMessage().contains("ORA-20004")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La hora seleccionada no está disponible para este sendero en el día indicado");
                error.put("message", "Por favor seleccione otro horario");
                return ResponseEntity.badRequest().body(error);
            } else if (e.getMessage().contains("ORA-20001")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El número de personas excede el cupo máximo del sendero");
                return ResponseEntity.badRequest().body(error);
            } else if (e.getMessage().contains("ORA-20002")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Ya existe una reserva para este sendero en el mismo horario");
                return ResponseEntity.badRequest().body(error);
            } else if (e.getMessage().contains("ORA-20003")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No hay cupo disponible para la fecha seleccionada");
                return ResponseEntity.badRequest().body(error);
            }
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear la reserva: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error inesperado: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/horarios-disponibles")
    public ResponseEntity<?> getHorariosDisponibles(
            @RequestParam Long senderoId,
            @RequestParam String fecha) {
        try {
            LocalDate fechaVisita = LocalDate.parse(fecha);
            List<Map<String, String>> horarios = reservaService.getHorariosDisponibles(senderoId, fechaVisita);
            return ResponseEntity.ok(horarios);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener horarios: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable Long id) {
        return reservaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/findByVisitante/{idVisitante}")
    public List<Reserva> getReservasByVisitante(@PathVariable Long idVisitante) {
        return reservaService.findByVisitanteId(idVisitante);
    }
    
    @GetMapping("/findBySendero/{idSendero}")
    public List<Reserva> getReservasBySendero(@PathVariable Long idSendero) {
        return reservaService.findBySenderoId(idSendero);
    }
    
    @GetMapping("/findByEstado/{estado}")
    public List<Reserva> getReservasByEstado(@PathVariable String estado) {
        return reservaService.findByEstado(estado);
    }
    
    @GetMapping("/sinGuia")
    public List<Reserva> getReservasSinGuia() {
        return reservaService.findReservasSinGuia();
    }
    
    @GetMapping("/guia/{idGuia}")
    public ResponseEntity<List<Reserva>> getReservasByGuia(@PathVariable Long idGuia) {
        try {
            List<Reserva> reservas = reservaService.findByGuiaId(idGuia);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/visitante/cedula/{cedula}")
    public ResponseEntity<List<Reserva>> getReservasByVisitanteCedula(@PathVariable String cedula) {
        try {
            List<Reserva> reservas = reservaService.findByVisitanteCedula(cedula);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        try {
            Reserva updatedReserva = reservaService.update(id, reserva);
            if (updatedReserva != null) {
                return ResponseEntity.ok(updatedReserva);
            }
            return ResponseEntity.notFound().build();
        } catch (JpaSystemException e) {
            if (e.getMessage().contains("ORA-20004")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La hora seleccionada no está disponible para este sendero en el día indicado");
                return ResponseEntity.badRequest().body(error);
            }
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al actualizar la reserva: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/cancelar/{id}")
    public ResponseEntity<Map<String, Object>> cancelarReserva(
            @PathVariable Long id, 
            @RequestParam(required = false) String motivo) {
        try {
            Reserva reservaCancelada = reservaService.cancelar(id, motivo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("idReserva", reservaCancelada.getIdReserva());
            response.put("estado", reservaCancelada.getEstado());
            response.put("mensaje", "Reserva cancelada exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteReserva(@PathVariable Long id) {
        boolean deleted = reservaService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.notFound().build();
    }
    
    
    /**
     * Crear reserva con asignación AUTOMÁTICA de guía
     * POST /reserva/crear-con-guia
     */
    @PostMapping("/crear-con-guia")
    public ResponseEntity<?> crearReservaConGuia(@RequestBody Map<String, Object> payload) {
        try {
        // 1. Extraer y validar datos
        String cedulaVisitante = (String) payload.get("cedulaVisitante");
        if (cedulaVisitante == null || cedulaVisitante.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "La cédula del visitante es obligatoria");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Validar y extraer datos numéricos
        Long idSendero;
        Integer numeroPersonas;
        try {
            idSendero = Long.valueOf(payload.get("idSendero").toString());
            numeroPersonas = Integer.valueOf(payload.get("numeroPersonas").toString());
        } catch (NumberFormatException | NullPointerException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Datos inválidos: idSendero y numeroPersonas deben ser números válidos");
            return ResponseEntity.badRequest().body(error);
        }
        
        String fechaVisita = (String) payload.get("fechaVisita");
        String horaInicio = (String) payload.get("horaInicio");
        String observaciones = payload.get("observaciones") != null ? 
                              (String) payload.get("observaciones") : "";
        
        // Validar campos obligatorios
        if (fechaVisita == null || fechaVisita.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "La fecha de visita es obligatoria");
            return ResponseEntity.badRequest().body(error);
        }
        
        if (horaInicio == null || horaInicio.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "La hora de inicio es obligatoria");
            return ResponseEntity.badRequest().body(error);
        }
        
        // 2. Buscar o crear visitante
        Visitante visitante;
        try {
            visitante = visitanteService.findByCedula(cedulaVisitante)
                .orElseGet(() -> {
                    // Si no existe, intentar crearlo con los datos proporcionados
                    String nombreVisitante = (String) payload.get("nombreVisitante");
                    String apellidoVisitante = (String) payload.get("apellidoVisitante");
                    String emailVisitante = (String) payload.get("emailVisitante");
                    String telefonoVisitante = payload.get("telefonoVisitante") != null ? 
                                             (String) payload.get("telefonoVisitante") : "";
                    
                    // Validar que se proporcionaron los datos mínimos para crear el visitante
                    if (nombreVisitante == null || nombreVisitante.trim().isEmpty() ||
                        apellidoVisitante == null || apellidoVisitante.trim().isEmpty() ||
                        emailVisitante == null || emailVisitante.trim().isEmpty()) {
                        throw new IllegalArgumentException(
                            "No se encontró un visitante con la cédula: " + cedulaVisitante + 
                            ". Para crear uno nuevo, proporciona: nombre, apellido y email."
                        );
                    }
                    
                    // Crear nuevo visitante
                    Visitante nuevoVisitante = new Visitante();
                    nuevoVisitante.setCedula(cedulaVisitante);
                    nuevoVisitante.setNombre(nombreVisitante);
                    nuevoVisitante.setApellido(apellidoVisitante);
                    nuevoVisitante.setEmail(emailVisitante);
                    if (telefonoVisitante != null && !telefonoVisitante.trim().isEmpty()) {
                        nuevoVisitante.setTelefono(telefonoVisitante);
                    }
                    nuevoVisitante.setEstado("ACTIVO");
                    
                    return visitanteService.save(nuevoVisitante);
                });
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear o buscar visitante: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
        
        // 3. Buscar sendero
        Sendero sendero = senderoService.findById(idSendero)
            .orElseThrow(() -> new IllegalArgumentException("Sendero no encontrado"));
        
        // 4. Validar estado del sendero
        if (!"ACTIVO".equals(sendero.getEstado())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "El sendero no está disponible");
            return ResponseEntity.badRequest().body(error);
        }
        
        // 5. Validar que el horario esté disponible para este sendero
        LocalDate fechaVisitaParsed = LocalDate.parse(fechaVisita);
        List<Map<String, String>> horariosDisponibles = reservaService.getHorariosDisponibles(idSendero, fechaVisitaParsed);
        
        // Normalizar formato de hora (asegurar formato HH:mm)
        String horaInicioNormalizada = horaInicio.length() == 5 ? horaInicio : 
                                      (horaInicio.length() > 5 ? horaInicio.substring(0, 5) : horaInicio);
        
        if (horariosDisponibles.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No hay horarios disponibles para este sendero en la fecha seleccionada");
            error.put("message", "Por favor seleccione otra fecha o contacte al administrador");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Validar que la hora seleccionada esté dentro de algún rango de horarios disponibles
        boolean horarioValido = false;
        StringBuilder horariosInfo = new StringBuilder();
        
        for (Map<String, String> horario : horariosDisponibles) {
            String horaInicioDisponible = horario.get("horaInicio");
            String horaFinDisponible = horario.get("horaFin");
            
            if (horaInicioDisponible != null && horaFinDisponible != null) {
                // Normalizar formatos
                String horaInicioDisp = horaInicioDisponible.length() > 5 ? 
                                       horaInicioDisponible.substring(0, 5) : horaInicioDisponible;
                String horaFinDisp = horaFinDisponible.length() > 5 ? 
                                    horaFinDisponible.substring(0, 5) : horaFinDisponible;
                
                horariosInfo.append(horaInicioDisp).append("-").append(horaFinDisp).append(", ");
                
                // Comparar horas en formato HH:mm (comparación lexicográfica funciona para este formato)
                if (horaInicioNormalizada.compareTo(horaInicioDisp) >= 0 && 
                    horaInicioNormalizada.compareTo(horaFinDisp) < 0) {
                    horarioValido = true;
                    break;
                }
            }
        }
        
        if (!horarioValido) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "La hora seleccionada (" + horaInicioNormalizada + 
                     ") no está disponible para este sendero en el día indicado");
            error.put("message", "Horarios disponibles: " + 
                     (horariosInfo.length() > 0 ? horariosInfo.substring(0, horariosInfo.length() - 2) : "Ninguno"));
            return ResponseEntity.badRequest().body(error);
        }
        
        // 6. Crear reserva
        Reserva reserva = new Reserva();
        reserva.setVisitante(visitante);
        reserva.setSendero(sendero);
        reserva.setFechaVisita(fechaVisitaParsed);
        reserva.setNumeroPersonas(numeroPersonas);
        reserva.setHoraInicio(horaInicioNormalizada);
        reserva.setObservaciones(observaciones);
        reserva.setEstado("PENDIENTE");
        reserva.setFechaReserva(LocalDate.now());
        
        // 7. Guardar reserva
        Reserva nuevaReserva = reservaService.save(reserva);
        
        // 8. Asignar guía automáticamente
        Guia guiaAsignado = null;
        try {
            List<Guia> guiasDisponibles = guiaService.findDisponibles(
                idSendero, fechaVisita, horaInicio
            );
            
            if (!guiasDisponibles.isEmpty()) {
                guiaAsignado = guiasDisponibles.get(0);
                
                AsignacionGuia asignacion = new AsignacionGuia();
                asignacion.setReserva(nuevaReserva);
                asignacion.setGuia(guiaAsignado);
                asignacion.setFechaAsignacion(LocalDate.now());
                asignacion.setObservacionesGuia("Asignación automática");
                
                asignacionGuiaService.save(asignacion);
            }
        } catch (Exception e) {
            System.err.println("Error al asignar guía: " + e.getMessage());
        }
        
        // 9. Respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("idReserva", nuevaReserva.getIdReserva());
        response.put("codigoConfirmacion", "RES-" + nuevaReserva.getIdReserva()); // ← CORREGIDO
        response.put("estado", nuevaReserva.getEstado());
        response.put("fechaVisita", nuevaReserva.getFechaVisita().toString());
        response.put("horaInicio", nuevaReserva.getHoraInicio());
        response.put("numeroPersonas", nuevaReserva.getNumeroPersonas());
        response.put("mensaje", "Reserva creada exitosamente");
        
        if (guiaAsignado != null) {
            Map<String, Object> guiaInfo = new HashMap<>();
            guiaInfo.put("idGuia", guiaAsignado.getIdGuia());
            guiaInfo.put("nombre", guiaAsignado.getNombre() + " " + guiaAsignado.getApellido());
            guiaInfo.put("telefono", guiaAsignado.getTelefono());
            response.put("guiaAsignado", guiaInfo);
        }
        
        return ResponseEntity.ok(response);
        
    } catch (JpaSystemException e) {
        if (e.getMessage().contains("ORA-20001")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "El número de personas excede el cupo máximo");
            return ResponseEntity.badRequest().body(error);
        } else if (e.getMessage().contains("ORA-20003")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No hay cupo disponible");
            return ResponseEntity.badRequest().body(error);
        } else if (e.getMessage().contains("ORA-20004")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "La hora seleccionada no está disponible para este sendero en el día indicado");
            error.put("message", "Por favor seleccione otro horario");
            return ResponseEntity.badRequest().body(error);
        }
        Map<String, String> error = new HashMap<>();
        error.put("error", "Error al crear reserva: " + e.getMessage());
        return ResponseEntity.badRequest().body(error);
    } catch (IllegalArgumentException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    } catch (Exception e) {
        e.printStackTrace();
        Map<String, String> error = new HashMap<>();
        error.put("error", "Error inesperado: " + e.getMessage());
        return ResponseEntity.status(500).body(error);
    }
}

    /**
     * Crear reserva con asignación MANUAL de guía
     * POST /reserva/crear-con-guia-manual
     */
    @PostMapping("/crear-con-guia-manual")
    public ResponseEntity<?> crearReservaConGuiaManual(@RequestBody Map<String, Object> payload) {
        try {
            // 1. Extraer y validar datos
            String cedulaVisitante = (String) payload.get("cedulaVisitante");
            if (cedulaVisitante == null || cedulaVisitante.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La cédula del visitante es obligatoria");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validar y extraer datos numéricos
            Long idSendero;
            Integer numeroPersonas;
            try {
                idSendero = Long.valueOf(payload.get("idSendero").toString());
                numeroPersonas = Integer.valueOf(payload.get("numeroPersonas").toString());
            } catch (NumberFormatException | NullPointerException e) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Datos inválidos: idSendero y numeroPersonas deben ser números válidos");
                return ResponseEntity.badRequest().body(error);
            }
            
            String fechaVisita = (String) payload.get("fechaVisita");
            String horaInicio = (String) payload.get("horaInicio");
            String observaciones = payload.get("observaciones") != null ? 
                                  (String) payload.get("observaciones") : "";
            
            // Validar campos obligatorios
            if (fechaVisita == null || fechaVisita.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La fecha de visita es obligatoria");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (horaInicio == null || horaInicio.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La hora de inicio es obligatoria");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validar que se proporcionó un idGuia
            Object idGuiaObj = payload.get("idGuia");
            if (idGuiaObj == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El ID del guía es obligatorio para asignación manual");
                return ResponseEntity.badRequest().body(error);
            }
            
            Long idGuia;
            try {
                idGuia = Long.valueOf(idGuiaObj.toString());
            } catch (NumberFormatException e) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El ID del guía debe ser un número válido");
                return ResponseEntity.badRequest().body(error);
            }
            
            // 2. Buscar o crear visitante
            Visitante visitante;
            try {
                visitante = visitanteService.findByCedula(cedulaVisitante)
                    .orElseGet(() -> {
                        // Si no existe, intentar crearlo con los datos proporcionados
                        String nombreVisitante = (String) payload.get("nombreVisitante");
                        String apellidoVisitante = (String) payload.get("apellidoVisitante");
                        String emailVisitante = (String) payload.get("emailVisitante");
                        String telefonoVisitante = payload.get("telefonoVisitante") != null ? 
                                                 (String) payload.get("telefonoVisitante") : "";
                        
                        // Validar que se proporcionaron los datos mínimos para crear el visitante
                        if (nombreVisitante == null || nombreVisitante.trim().isEmpty() ||
                            apellidoVisitante == null || apellidoVisitante.trim().isEmpty() ||
                            emailVisitante == null || emailVisitante.trim().isEmpty()) {
                            throw new IllegalArgumentException(
                                "No se encontró un visitante con la cédula: " + cedulaVisitante + 
                                ". Para crear uno nuevo, proporciona: nombre, apellido y email."
                            );
                        }
                        
                        // Crear nuevo visitante
                        Visitante nuevoVisitante = new Visitante();
                        nuevoVisitante.setCedula(cedulaVisitante);
                        nuevoVisitante.setNombre(nombreVisitante);
                        nuevoVisitante.setApellido(apellidoVisitante);
                        nuevoVisitante.setEmail(emailVisitante);
                        if (telefonoVisitante != null && !telefonoVisitante.trim().isEmpty()) {
                            nuevoVisitante.setTelefono(telefonoVisitante);
                        }
                        nuevoVisitante.setEstado("ACTIVO");
                        
                        return visitanteService.save(nuevoVisitante);
                    });
            } catch (IllegalArgumentException e) {
                Map<String, String> error = new HashMap<>();
                error.put("error", e.getMessage());
                return ResponseEntity.badRequest().body(error);
            } catch (Exception e) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Error al crear o buscar visitante: " + e.getMessage());
                return ResponseEntity.badRequest().body(error);
            }
            
            // 3. Buscar sendero
            Sendero sendero = senderoService.findById(idSendero)
                .orElseThrow(() -> new IllegalArgumentException("Sendero no encontrado"));
            
            // 4. Validar estado del sendero
            if (!"ACTIVO".equals(sendero.getEstado())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El sendero no está disponible");
                return ResponseEntity.badRequest().body(error);
            }
            
            // 5. Validar que el horario esté disponible para este sendero
            LocalDate fechaVisitaParsed = LocalDate.parse(fechaVisita);
            List<Map<String, String>> horariosDisponibles = reservaService.getHorariosDisponibles(idSendero, fechaVisitaParsed);
            
            // Normalizar formato de hora (asegurar formato HH:mm)
            String horaInicioNormalizada = horaInicio.length() == 5 ? horaInicio : 
                                          (horaInicio.length() > 5 ? horaInicio.substring(0, 5) : horaInicio);
            
            if (horariosDisponibles.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No hay horarios disponibles para este sendero en la fecha seleccionada");
                error.put("message", "Por favor seleccione otra fecha o contacte al administrador");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validar que la hora seleccionada esté dentro de algún rango de horarios disponibles
            boolean horarioValido = false;
            StringBuilder horariosInfo = new StringBuilder();
            
            for (Map<String, String> horario : horariosDisponibles) {
                String horaInicioDisponible = horario.get("horaInicio");
                String horaFinDisponible = horario.get("horaFin");
                
                if (horaInicioDisponible != null && horaFinDisponible != null) {
                    // Normalizar formatos
                    String horaInicioDisp = horaInicioDisponible.length() > 5 ? 
                                           horaInicioDisponible.substring(0, 5) : horaInicioDisponible;
                    String horaFinDisp = horaFinDisponible.length() > 5 ? 
                                        horaFinDisponible.substring(0, 5) : horaFinDisponible;
                    
                    horariosInfo.append(horaInicioDisp).append("-").append(horaFinDisp).append(", ");
                    
                    // Comparar horas en formato HH:mm (comparación lexicográfica funciona para este formato)
                    if (horaInicioNormalizada.compareTo(horaInicioDisp) >= 0 && 
                        horaInicioNormalizada.compareTo(horaFinDisp) < 0) {
                        horarioValido = true;
                        break;
                    }
                }
            }
            
            if (!horarioValido) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La hora seleccionada (" + horaInicioNormalizada + 
                         ") no está disponible para este sendero en el día indicado");
                error.put("message", "Horarios disponibles: " + 
                         (horariosInfo.length() > 0 ? horariosInfo.substring(0, horariosInfo.length() - 2) : "Ninguno"));
                return ResponseEntity.badRequest().body(error);
            }
            
            // 6. Buscar y validar guía
            Guia guia = guiaService.findById(idGuia)
                .orElseThrow(() -> new IllegalArgumentException("Guía no encontrado"));
            
            // 7. Validar que el guía está disponible
            List<Guia> guiasDisponibles = guiaService.findDisponibles(
                idSendero, fechaVisita, horaInicio
            );
            
            boolean guiaDisponible = guiasDisponibles.stream()
                .anyMatch(g -> g.getIdGuia().equals(idGuia));
            
            if (!guiaDisponible) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El guía seleccionado no está disponible para esta fecha y hora");
                return ResponseEntity.badRequest().body(error);
            }
            
            // 8. Crear reserva
            Reserva reserva = new Reserva();
            reserva.setVisitante(visitante);
            reserva.setSendero(sendero);
            reserva.setFechaVisita(fechaVisitaParsed);
            reserva.setNumeroPersonas(numeroPersonas);
            reserva.setHoraInicio(horaInicioNormalizada);
            reserva.setObservaciones(observaciones);
            reserva.setEstado("PENDIENTE");
            reserva.setFechaReserva(LocalDate.now());
            
            // 9. Guardar reserva
            Reserva nuevaReserva = reservaService.save(reserva);
            
            // 10. Asignar guía manualmente
            AsignacionGuia asignacion = new AsignacionGuia();
            asignacion.setReserva(nuevaReserva);
            asignacion.setGuia(guia);
            asignacion.setFechaAsignacion(LocalDate.now());
            asignacion.setObservacionesGuia("Asignación manual");
            
            asignacionGuiaService.save(asignacion);
            
            // 11. Respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("idReserva", nuevaReserva.getIdReserva());
            response.put("codigoConfirmacion", "RES-" + nuevaReserva.getIdReserva());
            response.put("estado", nuevaReserva.getEstado());
            response.put("fechaVisita", nuevaReserva.getFechaVisita().toString());
            response.put("horaInicio", nuevaReserva.getHoraInicio());
            response.put("numeroPersonas", nuevaReserva.getNumeroPersonas());
            response.put("mensaje", "Reserva creada exitosamente con guía asignado");
            
            Map<String, Object> guiaInfo = new HashMap<>();
            guiaInfo.put("idGuia", guia.getIdGuia());
            guiaInfo.put("nombre", guia.getNombre() + " " + guia.getApellido());
            guiaInfo.put("telefono", guia.getTelefono());
            response.put("guiaAsignado", guiaInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (JpaSystemException e) {
            if (e.getMessage().contains("ORA-20001")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "El número de personas excede el cupo máximo");
                return ResponseEntity.badRequest().body(error);
            } else if (e.getMessage().contains("ORA-20003")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No hay cupo disponible");
                return ResponseEntity.badRequest().body(error);
            } else if (e.getMessage().contains("ORA-20004")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La hora seleccionada no está disponible para este sendero en el día indicado");
                return ResponseEntity.badRequest().body(error);
            }
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear reserva: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error inesperado: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
