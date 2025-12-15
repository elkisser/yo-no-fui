import React, { useState, useEffect } from 'react';
import { FileText, Search, Archive, Home, Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [activePath, setActivePath] = useState('/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  const navItems = [
    { path: '/', label: 'Escritorio', icon: Home },
    { path: '/nuevo-caso', label: 'Nuevo Caso', icon: FileText },
    { path: '/investigar', label: 'Investigar', icon: Search },
    { path: '/archivo', label: 'Archivo', icon: Archive },
  ];

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const isActive = activePath === item.path;
    
    return (
      <a
        href={item.path}
        onClick={() => setActivePath(item.path)}
        className="relative px-6 py-3 group"
      >
        {/* Contenedor interno */}
        <div className={`flex items-center space-x-2 transition-all duration-300 ${
          isActive ? 'text-acento-azul' : 'text-texto-secundario hover:text-texto-principal'
        }`}>
          <Icon className={`w-4 h-4 transition-colors ${
            isActive ? 'text-acento-azul' : 'group-hover:text-acento-turquesa'
          }`} />
          <span className="font-medium text-sm tracking-wide">
            {item.label}
          </span>
        </div>
        
        {/* Línea inferior en hover/active */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform origin-left transition-all duration-300 ${
          isActive 
            ? 'scale-x-100 bg-gradient-to-r from-acento-azul to-acento-turquesa' 
            : 'scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-acento-azul/50 to-acento-turquesa/50'
        }`} />
        
        {/* Efecto de fondo en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-acento-azul/0 via-acento-azul/5 to-acento-azul/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </a>
    );
  };

  return (
    <>
      {/* Navegación Desktop */}
      <nav className="hidden lg:flex items-center">
        {navItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Botón Menú Móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2.5 rounded-lg bg-fondo-panel/30 border border-fondo-borde hover:border-acento-azul/50 transition-colors"
        aria-label="Menú de navegación"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-texto-principal" />
        ) : (
          <Menu className="w-5 h-5 text-texto-principal" />
        )}
      </button>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-fondo-principal/95 backdrop-blur-xl">
          <div className="flex flex-col h-full">
            {/* Header móvil */}
            <div className="flex items-center justify-between p-4 border-b border-fondo-borde">
              <Logo showText size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-fondo-panel transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items de navegación móvil */}
            <div className="flex-1 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePath === item.path;
                
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={() => {
                      setActivePath(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 p-3 my-1 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-acento-azul/10 to-acento-turquesa/10 border-l-4 border-acento-azul'
                        : 'hover:bg-fondo-panel/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      isActive ? 'text-acento-azul' : 'text-texto-secundario'
                    }`} />
                    <span className={`font-medium ${
                      isActive ? 'text-texto-principal' : 'text-texto-secundario'
                    }`}>
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;