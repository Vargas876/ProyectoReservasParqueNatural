package com.uptc.bases2.demo.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * Servicio para envío de correos electrónicos
 * Notificaciones de reservas, confirmaciones, recordatorios, etc.
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Enviar email simple (asíncrono)
     */
    @Async
    public void enviarEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            logger.info("Email enviado exitosamente a: {}", to);
            
        } catch (Exception e) {
            logger.error("Error al enviar email a {}: {}", to, e.getMessage());
        }
    }

    /**
     * Enviar email HTML (asíncrono)
     */
    @Async
    public void enviarEmailHtml(String to, String subject, String htmlBody) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML
            
            mailSender.send(mimeMessage);
            logger.info("Email HTML enviado exitosamente a: {}", to);
            
        } catch (MessagingException e) {
            logger.error("Error al enviar email HTML a {}: {}", to, e.getMessage());
        }
    }

    /**
     * Notificar nueva reserva al visitante
     */
    @Async
    public void notificarNuevaReserva(String emailVisitante, String nombreVisitante,
                                      String nombreSendero, LocalDate fechaVisita,
                                      LocalTime horaInicio, Integer numeroPersonas) {
        
        String subject = "Confirmación de Reserva - Parque Natural";
        
        String body = String.format(
            "Hola %s,\n\n" +
            "Tu reserva ha sido creada exitosamente.\n\n" +
            "Detalles de la reserva:\n" +
            "- Sendero: %s\n" +
            "- Fecha: %s\n" +
            "- Hora: %s\n" +
            "- Número de personas: %d\n\n" +
            "Tu reserva está en estado PENDIENTE. Te notificaremos cuando sea confirmada.\n\n" +
            "Recuerda llegar 15 minutos antes de la hora programada.\n\n" +
            "Saludos,\n" +
            "Equipo Parque Natural",
            nombreVisitante,
            nombreSendero,
            fechaVisita.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            horaInicio.format(DateTimeFormatter.ofPattern("HH:mm")),
            numeroPersonas
        );
        
        enviarEmail(emailVisitante, subject, body);
    }

    /**
     * Notificar confirmación de reserva
     */
    @Async
    public void notificarReservaConfirmada(String emailVisitante, String nombreVisitante,
                                           String nombreSendero, LocalDate fechaVisita,
                                           LocalTime horaInicio) {
        
        String subject = "Reserva Confirmada - Parque Natural";
        
        String body = String.format(
            "Hola %s,\n\n" +
            "¡Excelente noticia! Tu reserva ha sido confirmada.\n\n" +
            "Detalles:\n" +
            "- Sendero: %s\n" +
            "- Fecha: %s\n" +
            "- Hora: %s\n\n" +
            "Por favor, presenta tu documento de identidad al llegar.\n\n" +
            "¡Te esperamos!\n\n" +
            "Saludos,\n" +
            "Equipo Parque Natural",
            nombreVisitante,
            nombreSendero,
            fechaVisita.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            horaInicio.format(DateTimeFormatter.ofPattern("HH:mm"))
        );
        
        enviarEmail(emailVisitante, subject, body);
    }

    /**
     * Notificar cancelación de reserva
     */
    @Async
    public void notificarReservaCancelada(String emailVisitante, String nombreVisitante,
                                          String nombreSendero, String motivo) {
        
        String subject = "Reserva Cancelada - Parque Natural";
        
        String body = String.format(
            "Hola %s,\n\n" +
            "Tu reserva para el sendero '%s' ha sido cancelada.\n\n" +
            "Motivo: %s\n\n" +
            "Puedes crear una nueva reserva cuando lo desees a través de nuestra plataforma.\n\n" +
            "Saludos,\n" +
            "Equipo Parque Natural",
            nombreVisitante,
            nombreSendero,
            motivo != null ? motivo : "No especificado"
        );
        
        enviarEmail(emailVisitante, subject, body);
    }

    /**
     * Notificar asignación de guía
     */
    @Async
    public void notificarAsignacionGuia(String emailVisitante, String nombreVisitante,
                                        String nombreGuia, String nombreSendero,
                                        LocalDate fechaVisita, LocalTime horaInicio) {
        
        String subject = "Guía Asignado - Parque Natural";
        
        String body = String.format(
            "Hola %s,\n\n" +
            "Se ha asignado un guía para tu recorrido.\n\n" +
            "Detalles:\n" +
            "- Guía: %s\n" +
            "- Sendero: %s\n" +
            "- Fecha: %s\n" +
            "- Hora: %s\n\n" +
            "Tu guía te estará esperando en el punto de encuentro.\n\n" +
            "Saludos,\n" +
            "Equipo Parque Natural",
            nombreVisitante,
            nombreGuia,
            nombreSendero,
            fechaVisita.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            horaInicio.format(DateTimeFormatter.ofPattern("HH:mm"))
        );
        
        enviarEmail(emailVisitante, subject, body);
    }

    /**
     * Recordatorio de reserva (enviar 1 día antes)
     */
    @Async
    public void enviarRecordatorioReserva(String emailVisitante, String nombreVisitante,
                                          String nombreSendero, LocalDate fechaVisita,
                                          LocalTime horaInicio) {
        
        String subject = "Recordatorio de Reserva - Parque Natural";
        
        String body = String.format(
            "Hola %s,\n\n" +
            "Este es un recordatorio de tu reserva para mañana.\n\n" +
            "Detalles:\n" +
            "- Sendero: %s\n" +
            "- Fecha: %s\n" +
            "- Hora: %s\n\n" +
            "Recomendaciones:\n" +
            "- Llega 15 minutos antes\n" +
            "- Trae agua y protector solar\n" +
            "- Usa calzado cómodo\n" +
            "- Presenta tu documento de identidad\n\n" +
            "¡Nos vemos mañana!\n\n" +
            "Saludos,\n" +
            "Equipo Parque Natural",
            nombreVisitante,
            nombreSendero,
            fechaVisita.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            horaInicio.format(DateTimeFormatter.ofPattern("HH:mm"))
        );
        
        enviarEmail(emailVisitante, subject, body);
    }

    /**
     * Notificar al guía sobre nueva asignación
     */
    @Async
    public void notificarGuiaNuevaAsignacion(String emailGuia, String nombreGuia,
                                             String nombreSendero, LocalDate fechaVisita,
                                             LocalTime horaInicio, Integer numeroPersonas,
                                             String nombreVisitante, String telefonoVisitante) {
        
        String subject = "Nueva Asignación de Recorrido - Parque Natural";
        
        String body = String.format(
            "Hola %s,\n\n" +
            "Se te ha asignado un nuevo recorrido.\n\n" +
            "Detalles:\n" +
            "- Sendero: %s\n" +
            "- Fecha: %s\n" +
            "- Hora: %s\n" +
            "- Grupo: %d personas\n" +
            "- Responsable: %s\n" +
            "- Teléfono contacto: %s\n\n" +
            "Por favor, confirma tu disponibilidad a través de la plataforma.\n\n" +
            "Saludos,\n" +
            "Equipo Parque Natural",
            nombreGuia,
            nombreSendero,
            fechaVisita.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            horaInicio.format(DateTimeFormatter.ofPattern("HH:mm")),
            numeroPersonas,
            nombreVisitante,
            telefonoVisitante != null ? telefonoVisitante : "No especificado"
        );
        
        enviarEmail(emailGuia, subject, body);
    }

    /**
     * Email de bienvenida a nuevo usuario
     */
    @Async
    public void enviarEmailBienvenida(String email, String nombre, String rol) {
        String subject = "Bienvenido al Parque Natural";
        
        String body = String.format(
            "Hola %s,\n\n" +
            "¡Bienvenido al sistema de reservas del Parque Natural!\n\n" +
            "Tu cuenta como %s ha sido creada exitosamente.\n\n" +
            "Ahora puedes acceder a la plataforma y disfrutar de nuestros servicios.\n\n" +
            "Si tienes alguna pregunta, no dudes en contactarnos.\n\n" +
            "Saludos,\n" +
            "Equipo Parque Natural",
            nombre,
            rol.equals("VISITANTE") ? "Visitante" : "Guía"
        );
        
        enviarEmail(email, subject, body);
    }
}
