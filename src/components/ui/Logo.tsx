import React from 'react';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ showText = true, size = 'md' }) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <a href="/" className="flex items-center space-x-3 group">
      <div className="relative">
        <div className={`${sizes[size]} w-auto transition-transform duration-300 group-hover:scale-105`}>
          <svg 
            width={size === 'sm' ? 32 : size === 'md' ? 40 : 48} 
            height={size === 'sm' ? 32 : size === 'md' ? 40 : 48} 
            viewBox="0 0 40 40" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Fondo con gradiente */}
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4DA3FF" />
                <stop offset="100%" stopColor="#5EEAD4" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4DA3FF" floodOpacity="0.3"/>
              </filter>
            </defs>
            
            {/* Círculo de fondo */}
            <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" fillOpacity="0.1" />
            
            {/* Lupa de investigación (estilo elegante) */}
            <circle 
              cx="20" 
              cy="15" 
              r="8" 
              stroke="url(#logoGradient)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              fill="none"
              filter="url(#shadow)"
            />
            
            {/* Mango de lupa */}
            <line 
              x1="26" 
              y1="23" 
              x2="32" 
              y2="29" 
              stroke="url(#logoGradient)" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            
            {/* Huella digital estilizada */}
            <path 
              d="M12 28 Q14 24 16 26 Q18 28 16 30 Q14 32 12 28" 
              stroke="url(#logoGradient)" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Punto de la huella */}
            <circle cx="12" cy="28" r="1.5" fill="url(#logoGradient)" />
            
            {/* Estrella de sheriff minimalista */}
            <path 
              d="M28 10 L30 14 L34 14 L31 17 L32 21 L28 18 L24 21 L25 17 L22 14 L26 14 Z" 
              fill="url(#logoGradient)" 
              fillOpacity="0.8"
            />
          </svg>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif font-bold leading-tight ${textSizes[size]}`}>
            <span className="bg-gradient-to-r from-acento-azul to-acento-turquesa bg-clip-text text-transparent">
              Yo no fui
            </span>
          </span>
          <span className="text-xs text-texto-secundario tracking-wider font-mono mt-0.5">
            INVESTIGACIÓN
          </span>
        </div>
      )}
    </a>
  );
};

export default Logo;