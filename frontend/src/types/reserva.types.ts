export interface Reserva {
    idReserva: number;
    codigoConfirmacion: string;
    fechaReserva: string;
    fechaVisita: string;
    horaInicio: string;
    estado: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';
    numeroPersonas: number;
    costoTotal?: number;
    observaciones?: string;
  }
  
  export interface ReservaRequest {
    cedulaVisitante: string;
    idSendero: number;
    fechaVisita: string;
    numeroPersonas: number;
    horaInicio: string;
    observaciones?: string;
  }
  
  export interface ReservaCompleta extends Reserva {
    visitanteNombreCompleto: string;
    visitanteCedula: string;
    visitanteEmail: string;
    visitanteTelefono: string;
    senderoNombre: string;
    senderoDificultad: string;
    senderoDistancia: number;
    senderoDuracion: number;
    guiaNombreCompleto?: string;
    guiaTelefono?: string;
  }
  