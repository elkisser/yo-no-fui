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
          dificultad: dificultadMap[complejidad] || 'media'
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
    <div className="w-full">
      {/* Panel de configuración */}
      <div className="bg-fondo-panel/50 border border-fondo-borde rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-acento-azul" />
            <h2 className="text-xl font-serif text-texto-principal">
              Configurar caso
            </h2>
          </div>
          <div className="text-sm text-texto-secundario">
            Paso 1 de 2
          </div>
        </div>

        {/* Selector de tema */}
        <div className="mb-6">
          <label className="block text-texto-principal mb-2 text-sm font-medium">
            Tema preferido (Solo IA)
          </label>
          <select 
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full bg-fondo-secundario border border-fondo-borde rounded-lg px-4 py-3 text-texto-principal text-sm focus:outline-none focus:border-acento-azul transition-colors hover:border-acento-azul/50"
          >
            <option value="">Sorpréndeme - Tema aleatorio</option>
            <option value="asesinato">Asesinato misterioso</option>
            <option value="robo">Robo de alto perfil</option>
            <option value="desaparicion">Desaparición inexplicable</option>
            <option value="corporativo">Crimen corporativo</option>
            <option value="historico">Misterio histórico</option>
          </select>
        </div>

        {/* Selector de complejidad */}
        <div className="mb-6">
          <label className="block text-texto-principal mb-3 text-sm font-medium">
            Dificultad
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'baja', label: 'Fácil', desc: 'Pistas claras', color: 'from-green-500/20 to-green-500' },
              { id: 'media', label: 'Media', desc: 'Desafío normal', color: 'from-acento-azul/20 to-acento-azul' },
              { id: 'alta', label: 'Difícil', desc: 'Misterio complejo', color: 'from-red-500/20 to-red-500' }
            ].map((nivel) => (
              <button
                key={nivel.id}
                onClick={() => setComplejidad(nivel.id)}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  complejidad === nivel.id
                    ? `border-${nivel.color.split(' ')[1].split('/')[0]} bg-gradient-to-b ${nivel.color}/10`
                    : 'border-fondo-borde bg-fondo-secundario hover:border-acento-azul/30'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  complejidad === nivel.id ? 'text-texto-principal' : 'text-texto-secundario'
                }`}>
                  {nivel.label}
                </div>
                <div className="text-xs text-texto-secundario">
                  {nivel.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 text-sm font-medium">Error al generar</p>
                <p className="text-red-400/80 text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Botón de generación con IA */}
        <button
          onClick={() => generarCaso()}
          disabled={cargando}
          className="w-full py-4 bg-gradient-to-r from-acento-azul to-acento-turquesa text-fondo-principal font-medium rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          {cargando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Conectando con la Central...</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Generar Nuevo Caso (IA)</span>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>

        {/* Botón de generación Offline */}
        <button
          onClick={() => generarCaso('offline')}
          disabled={cargando}
          className="w-full py-3 bg-fondo-secundario border border-fondo-borde text-texto-secundario hover:text-texto-principal hover:border-acento-azul/50 font-medium rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <WifiOff className="w-4 h-4" />
          <span>Jugar sin conexión (Caso Aleatorio)</span>
        </button>
      </div>

      {/* Nota de advertencia */}
      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-400 text-xs leading-relaxed">
            La generación con IA requiere conexión. Si falla o no tienes internet, usa el modo "Sin conexión" para jugar casos predefinidos de la dificultad seleccionada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneradorCaso;