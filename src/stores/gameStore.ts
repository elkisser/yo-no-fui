import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  resultado?: string;
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

interface GameStore {
  casoActual: Caso | null;
  pistasDescubiertas: string[];
  ayudasUsadas: string[];
  hipotesisActual: string | null;
  historialCasos: string[];
  errores: number;
  tiempoInicio: Date | null;

  setCasoActual: (caso: Caso) => void;
  descubrirPista: (pistaId: string) => void;
  usarAyuda: (ayudaId: string) => boolean;
  proponerCulpable: (sospechosoId: string) => boolean;
  setHipotesis: (hipotesis: string) => void;
  reiniciarCaso: () => void;
  nuevoCaso: () => void;
  getTiempoTranscurrido: () => string;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      casoActual: null,
      pistasDescubiertas: [],
      ayudasUsadas: [],
      hipotesisActual: null,
      historialCasos: [],
      errores: 0,
      tiempoInicio: null,

      setCasoActual: (caso) => set({ 
        casoActual: caso,
        pistasDescubiertas: [],
        ayudasUsadas: [],
        hipotesisActual: null,
        errores: 0,
        tiempoInicio: new Date()
      }),

      descubrirPista: (pistaId) => set((state) => ({
        pistasDescubiertas: [...state.pistasDescubiertas, pistaId]
      })),

      usarAyuda: (ayudaId) => {
        const state = get();
        if (state.ayudasUsadas.length >= 3 || state.ayudasUsadas.includes(ayudaId)) {
          return false;
        }
        set({ ayudasUsadas: [...state.ayudasUsadas, ayudaId] });
        return true;
      },

      proponerCulpable: (sospechosoId) => {
        const state = get();
        if (!state.casoActual) return false;

        const esCorrecto = sospechosoId === state.casoActual.culpableId;

        if (esCorrecto) {
          set({
            casoActual: { ...state.casoActual, resuelto: true },
            historialCasos: [...state.historialCasos, state.casoActual.id]
          });
        } else {
          set({ errores: state.errores + 1 });
        }

        return esCorrecto;
      },

      setHipotesis: (hipotesis) => set({ hipotesisActual: hipotesis }),

      reiniciarCaso: () => set({
        pistasDescubiertas: [],
        ayudasUsadas: [],
        hipotesisActual: null,
        errores: 0,
        tiempoInicio: new Date()
      }),

      nuevoCaso: () => set({
        casoActual: null,
        pistasDescubiertas: [],
        ayudasUsadas: [],
        hipotesisActual: null,
        tiempoInicio: null
      }),

      getTiempoTranscurrido: () => {
        const state = get();
        if (!state.tiempoInicio) return '00:00';

        const inicio = new Date(state.tiempoInicio);
        const diffMs = new Date().getTime() - inicio.getTime();

        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num: number) => num.toString().padStart(2, '0');

        if (hours > 0) {
          return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
        return `${pad(minutes)}:${pad(seconds)}`;
      }
    }),
    {
      name: 'yo-no-fui-storage',
      partialize: (state) => ({
        casoActual: state.casoActual,
        historialCasos: state.historialCasos,
        tiempoInicio: state.tiempoInicio
      })
    }
  )
);