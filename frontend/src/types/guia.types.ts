export interface Guia {
  idGuia: number;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  especialidades?: string;
  estado: string;
  fechaContratacion?: string;
  calificacionPromedio?: number;
}