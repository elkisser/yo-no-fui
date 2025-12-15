export interface Sospechoso {
  id: string;
  nombre: string;
  descripcion: string;
  motivacion?: string;
  alibi?: string;
  confianza?: number;
}

export interface Pista {
  id: string;
  titulo: string;
  descripcion: string;
  relevancia: 'alta' | 'media' | 'baja';
  confiable: boolean;
  descubierta?: boolean;
  sospechososVinculados: string[];
}

export interface Ayuda {
  id: string;
  nombre: string;
  descripcion: string;
  disponible: boolean;
}

export interface Caso {
  id: string;
  titulo: string;
  historia: string;
  ambientacion: string;
  sospechosos: Sospechoso[];
  pistas: Pista[];
  ayudas: Ayuda[];
  culpableId: string;
  resuelto: boolean;
  creadoEn: string;
  usandoEjemplo?: boolean;
}

export interface PeticionCaso {
  tema?: string;
  complejidad?: 'baja' | 'media' | 'alta';
}

export interface ErrorNarrativo {
  titulo: string;
  mensaje: string;
  tipo: 'error' | 'advertencia' | 'informacion';
}