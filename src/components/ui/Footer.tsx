import React from 'react';
import { Github, ExternalLink, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = 2025;

  return (
    <footer className="bg-fondo-secundario border-t border-fondo-borde">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Información izquierda */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-sm text-texto-secundario">Desarrollado por</span>
              <a 
                href="https://somos-env.netlify.app" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-acento-azul hover:text-acento-turquesa transition-colors font-medium text-sm group"
              >
                SoMoS
                <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
            
            <p className="text-xs text-texto-secundario/60">
              © {currentYear} Yo no fui • Investigación Criminal
            </p>
          </div>

          {/* Separador visual */}
          <div className="hidden md:block w-px h-6 bg-gradient-to-b from-transparent via-fondo-borde to-transparent"></div>

          {/* Enlaces centrales */}
          <div className="flex items-center">
            {(
              [
                { href: '/', label: 'Inicio' },
                { href: '/nuevo-caso', label: 'Nuevo Caso' },
                { href: '/archivo', label: 'Archivo' },
              ] as const
            ).map((link, index, all) => (
              <React.Fragment key={link.href}>
                <a
                  href={link.href}
                  className="text-xs text-texto-secundario hover:text-acento-turquesa transition-colors"
                >
                  {link.label}
                </a>
                {index < all.length - 1 && (
                  <span aria-hidden="true" className="mx-4 inline-flex items-center text-texto-secundario/50">
                    <svg width="4" height="4" viewBox="0 0 4 4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="2" cy="2" r="2" />
                    </svg>
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Separador visual */}
          <div className="hidden md:block w-px h-6 bg-gradient-to-b from-transparent via-fondo-borde to-transparent"></div>

          {/* GitHub */}
          <div className="flex items-center gap-2">
            <a 
              href="https://github.com/elkisser" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-texto-secundario hover:text-texto-principal transition-colors group"
              aria-label="GitHub del desarrollador"
            >
              <Github className="w-4 h-4 mr-1 group-hover:text-acento-turquesa transition-colors" />
              <span className="text-xs font-mono">elkisser</span>
            </a>
            <div className="text-xs text-texto-secundario/40">•</div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400 animate-pulse" />
              <span className="text-xs text-texto-secundario/60">v1.0</span>
            </div>
          </div>
        </div>

        {/* Línea divisoria sutil */}
        <div className="mt-6 pt-6 border-t border-fondo-borde/30">
          <p className="text-center text-xs text-texto-secundario/40 leading-relaxed max-w-2xl mx-auto">
            Diversión en grupo • Casos generados por IA • Cada misterio es único
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;