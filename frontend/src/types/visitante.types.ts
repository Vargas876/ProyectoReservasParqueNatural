export interface Visitante {
    idVisitante: number;
    cedula: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaRegistro: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';
    fechaNacimiento?: string;
    direccion?: string;
  }
  
  export interface VisitanteRequest {
    cedula: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaNacimiento?: string;
    direccion?: string;
  }
  