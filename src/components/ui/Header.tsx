import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import { Clock, Target } from 'lucide-react';

const Header: React.FC = () => {
  const [casoActivo, setCasoActivo] = useState<any>(null);

  useEffect(() => {
    const syncCasoActivo = () => {
      const storeData = localStorage.getItem('yo-no-fui-storage');
      if (!storeData) return setCasoActivo(null);

      try {
        const parsed = JSON.parse(storeData);
        const caso = parsed?.state?.casoActual;
        setCasoActivo(caso && !caso.resuelto ? caso : null);
      } catch {
        setCasoActivo(null);
      }
    };

    syncCasoActivo();
    window.addEventListener('storage', syncCasoActivo);

    return () => window.removeEventListener('storage', syncCasoActivo);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-fondo-secundario/95 backdrop-blur-sm border-b border-fondo-borde">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo showText size="md" />

          {/* Navegación */}
          <Navigation casoActivo={!!casoActivo} />

          {/* Indicador de estado */}
          <div className="hidden lg:flex items-center gap-4">
            {casoActivo ? (
              <a 
                href="/investigar" 
                className="flex items-center gap-2 px-3 py-1.5 bg-fondo-panel/50 border border-fondo-borde rounded-lg hover:border-acento-azul/50 transition-colors group"
              >
                <Clock className="w-4 h-4 text-acento-turquesa" />
                <div className="text-xs">
                  <div className="text-texto-secundario">Investigando</div>
                  <div className="text-texto-principal font-medium truncate max-w-[150px]">
                    {casoActivo.titulo}
                  </div>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-fondo-panel/30 border border-fondo-borde rounded-lg">
                <Target className="w-4 h-4 text-texto-secundario" />
                <div className="text-xs text-texto-secundario">Sin caso activo</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;