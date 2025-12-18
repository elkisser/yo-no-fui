import React, { useState } from 'react';
import { FileText, AlertCircle, Loader2, Settings, WifiOff } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

interface GeneradorCasoProps {
  onCasoGenerado?: (caso: any) => void;
}

const GeneradorCaso: React.FC<GeneradorCasoProps> = ({ onCasoGenerado }) => {
  const setCasoActual = useGameStore(state => state.setCasoActual);
  const [cargando, setCargando] = useState(false);
  const [tema, setTema] = useState('');
  const [complejidad, setComplejidad] = useState('media');
  const [error, setError] = useState<string | null>(null);

  const generarCaso = async (temaOverride?: string) => {
    setCargando(true);
    setError(null);
    
    try {
      console.log('Iniciando generación de caso...');

      let historialTitulos: string[] = [];
      try {
        const historial = JSON.parse(localStorage.getItem('historial-casos') || '[]');
        if (Array.isArray(historial)) {
          historialTitulos = historial
            .map((h: any) => h?.titulo)
            .filter((t: any) => typeof t === 'string' && t.trim());
        }
      } catch (_) {
        historialTitulos = [];
      }
      
      const dificultadMap: Record<string, string> = {
        'baja': 'fácil',
        'media': 'media',
        'alta': 'difícil'
      };

      const response = await fetch('/api/generar-caso', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          tema: temaOverride || tema || undefined,
          dificultad: dificultadMap[complejidad] || 'media',
          historialTitulos
        })
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = 'Error al conectar con el servidor';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.mensaje || errorMessage;
        } catch (e) {
          if (responseText.trim()) {
            errorMessage = responseText;
          } else {
            errorMessage = `Error HTTP: ${response.status} ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      let caso;
      try {
        caso = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', responseText);
        throw new Error('Respuesta del servidor en formato inválido');
      }
      
      console.log('Caso recibido:', caso?.titulo || 'Sin título');
      
      if (caso.esFallback || caso.source === 'fallback') {
        const msg = caso.errorOriginal ? `Modo Offline: ${caso.errorOriginal}` : 'Modo Offline activado';
        console.warn(msg);
      }
      
      if (!caso || !caso.titulo) {
        throw new Error('Estructura del caso inválida recibida del servidor');
      }

      const casoCompleto = {
        ...caso,
        id: caso.id || `caso_${Date.now()}`,
        resuelto: false,
        isOffline: caso.source === 'example' || caso.source === 'fallback' || temaOverride === 'offline',
        creadoEn: new Date().toISOString(),
        configuracion: {
          tema: temaOverride || tema || 'aleatorio',
          complejidad: complejidad || 'media',
          generadoEn: new Date().toISOString()
        }
      };

      useGameStore.getState().nuevoCaso();
      setCasoActual(casoCompleto);
      
      setTimeout(() => {
        window.location.href = '/investigar';
      }, 800);
      
    } catch (error) {
      console.error('Error en generarCaso:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al generar el caso');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Panel de configuración */}
      <div className="card-neu p-8 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Settings className="w-24 h-24 text-acento-azul transformer rotate-45" />
        </div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-acento-azul/10 rounded-lg">
              <Settings className="w-6 h-6 text-acento-azul" />
            </div>
            <h2 className="text-2xl font-serif text-texto-principal tracking-wide">
              Configurar Misión
            </h2>
          </div>
          <div className="text-sm font-mono text-acento-turquesa bg-acento-turquesa/10 px-3 py-1 rounded-full border border-acento-turquesa/20">
            FASE 1 - PREPARACIÓN
          </div>
        </div>

        {/* Selector de tema */}
        <div className="mb-8 relative z-10">
          <label className="block text-texto-principal mb-3 text-sm font-bold uppercase tracking-wider">
            Tema de Investigación (IA)
          </label>
          <div className="relative">
            <select 
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="w-full bg-fondo-secundario/50 border border-fondo-borde rounded-xl px-5 py-4 text-texto-principal text-base focus:outline-none focus:border-acento-azul focus:ring-2 focus:ring-acento-azul/20 transition-all appearance-none cursor-pointer hover:bg-fondo-secundario hover:border-acento-azul/50"
            >
              <option value="">Sorpréndeme - Tema aleatorio</option>
              <option value="asesinato">Asesinato misterioso</option>
              <option value="robo">Robo de alto perfil</option>
              <option value="desaparicion">Desaparición inexplicable</option>
              <option value="corporativo">Crimen corporativo</option>
              <option value="historico">Misterio histórico</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-texto-secundario">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Selector de complejidad */}
        <div className="mb-8 relative z-10">
          <label className="block text-texto-principal mb-4 text-sm font-bold uppercase tracking-wider">
            Nivel de Amenaza
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'baja', label: 'Baja', desc: 'Para reclutas', color: 'from-green-500/20 to-green-500', icon: '🟢' },
              { id: 'media', label: 'Media', desc: 'Agente de campo', color: 'from-acento-azul/20 to-acento-azul', icon: '🔵' },
              { id: 'alta', label: 'Alta', desc: 'Detective veterano', color: 'from-red-500/20 to-red-500', icon: '🔴' }
            ].map((nivel) => (
              <button
                key={nivel.id}
                onClick={() => setComplejidad(nivel.id)}
                className={`p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group/btn ${
                  complejidad === nivel.id
                    ? `border-${nivel.color.split(' ')[1].split('/')[0]} bg-gradient-to-b ${nivel.color}/10 shadow-lg`
                    : 'border-fondo-borde bg-fondo-secundario/30 hover:border-acento-azul/50 hover:bg-fondo-secundario'
                }`}
              >
                <div className={`text-base font-bold mb-1 flex items-center gap-2 ${
                  complejidad === nivel.id ? 'text-texto-principal' : 'text-texto-secundario'
                }`}>
                  <span>{nivel.icon}</span> {nivel.label}
                </div>
                <div className="text-xs text-texto-secundario font-mono opacity-80">
                  {nivel.desc}
                </div>
                {complejidad === nivel.id && (
                  <div className="absolute inset-0 border-2 border-current opacity-20 rounded-xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 text-sm font-bold">ERROR DE SISTEMA</p>
                <p className="text-red-400/80 text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Botón de generación con IA */}
        <button
          onClick={() => generarCaso()}
          disabled={cargando}
          className="w-full py-5 bg-gradient-to-r from-acento-azul via-acento-turquesa to-acento-azul background-animate bg-[length:200%_auto] text-fondo-principal font-bold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(77,163,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group shadow-xl active:scale-[0.99]"
        >
          {cargando ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="animate-pulse">ESTABLECIENDO ENLACE SEGURO...</span>
            </>
          ) : (
            <>
              <FileText className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
              <span className="tracking-wide">INICIAR GENERACIÓN IA</span>
            </>
          )}
        </button>

        {/* Botón de generación Offline */}
        <button
          onClick={() => generarCaso('offline')}
          disabled={cargando}
          className="w-full py-4 bg-fondo-secundario border border-fondo-borde/50 text-texto-secundario hover:text-texto-principal hover:border-white/20 hover:bg-fondo-panel font-medium rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
          <WifiOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Acceder en Modo Offline (Simulación)</span>
        </button>
      </div>

      {/* Nota de advertencia */}
      <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-400/80 text-xs leading-relaxed font-mono">
            NOTA: La generación neural (IA) requiere enlace de red activo. En caso de fallo de conexión, utilice el modo Offline para simulaciones pre-cargadas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneradorCaso;