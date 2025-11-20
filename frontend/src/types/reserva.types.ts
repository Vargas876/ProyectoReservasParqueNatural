// Tipo básico de Reserva (lo que se envía al crear)
export interface ReservaRequest {
  cedulaVisitante: string;
  idSendero: number;
  fechaVisita: string;
  numeroPersonas: number;
  horaInicio: string;
  observaciones?: string;
  idGuia?: number;
  // Datos opcionales del visitante (para crear automáticamente si no existe)
  nombreVisitante?: string;
  apellidoVisitante?: string;
  emailVisitante?: string;
  telefonoVisitante?: string;
}

// Tipo de Visitante anidado
export interface VisitanteSimple {
  idVisitante: number;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}

// Tipo de Sendero anidado
export interface SenderoSimple {
  idSendero: number;
  nombre: string;
  descripcion?: string;
  dificultad: string;
  distanciaKm: number;
  duracionHoras: number;
}

// Tipo de Guía anidado
export interface GuiaSimple {
  idGuia: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  especialidades?: string;
}

// Tipo de AsignacionGuia - CORREGIDO ⬇️
export interface AsignacionGuia {
  idAsignacion: number;
  guia: GuiaSimple;
  fechaAsignacion: string;
  horaInicioReal?: string;
  horaFinReal?: string;
  observacionesGuia?: string;
}

// Tipo completo de Reserva (lo que devuelve el backend) - CORREGIDO ⬇️
export interface Reserva {
  idReserva: number;
  codigoConfirmacion?: string;
  fechaReserva: string;
  fechaVisita: string;
  horaInicio: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';
  numeroPersonas: number;
  costoTotal?: number;
  observaciones?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  
  // Relaciones anidadas (lo que devuelve el backend con JPA)
  visitante: VisitanteSimple;
  sendero: SenderoSimple;
  asignacion?: AsignacionGuia; // ⬅️ CAMBIO: singular, no plural, opcional
}

// Tipo alternativo con nombres planos (si usas proyecciones en el backend)
export interface ReservaCompleta {
  idReserva: number;
  codigoConfirmacion?: string;
  fechaReserva: string;
  fechaVisita: string;
  horaInicio: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';
  numeroPersonas: number;
  costoTotal?: number;
  observaciones?: string;
  
  // Campos planos del visitante
  visitanteNombreCompleto: string;
  visitanteCedula: string;
  visitanteEmail: string;
  visitanteTelefono?: string;
  
  // Campos planos del sendero
  senderoNombre: string;
  senderoDificultad: string;
  senderoDistancia: number;
  senderoDuracion: number;
  
  // Campos planos del guía (si existe)
  guiaNombreCompleto?: string;
  guiaTelefono?: string;
  guiaEmail?: string;
  idGuia?: number;
}