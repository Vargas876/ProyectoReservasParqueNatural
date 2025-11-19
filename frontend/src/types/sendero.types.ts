export interface Sendero {
    idSendero: number;
    nombre: string;
    descripcion?: string;
    dificultad: 'FACIL' | 'MODERADO' | 'DIFICIL' | 'EXTREMO';
    distanciaKm: number;
    duracionHoras: number;
    cupoMaximoDia: number;
    estado: 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO';
    requiereGuia: 'S' | 'N';
    altitudMaxima?: number;
    fechaCreacion?: string;
  }
  
  export interface DisponibilidadSendero {
    idSendero: number;
    senderoNombre: string;
    dificultad: string;
    duracionHoras: number;
    cupoMaximoDia: number;
    fechaVisita: string;
    personasReservadas: number;
    cuposDisponibles: number;
  }
  