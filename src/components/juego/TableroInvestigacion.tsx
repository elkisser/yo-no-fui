import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { jsPDF } from 'jspdf';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  HelpCircle,
  Loader2,
  MessageSquare,
  Search,
  Target,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';

const PanelSospechosos: React.FC<{
  proponiendo: string | null;
  onProponer: (id: string) => void;
}> = ({ proponiendo, onProponer }) => {
  const { casoActual } = useGameStore();
  
  if (!casoActual) return null;

  return (
    <div className="space-y-6 animate-slide-up" data-guide="investigar-panel-sospechosos">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-serif text-texto-principal flex items-center gap-3" data-guide="investigar-sospechosos-titulo">
          <Users className="w-6 h-6 text-acento-azul" />
          Perfiles de Sospechosos
        </h3>
        
        <span className="text-sm text-texto-secundario bg-fondo-borde/50 backdrop-blur-sm px-3 py-1 rounded-full border border-fondo-borde/30">
          {casoActual.sospechosos.length} registros
        </span>
      </div>
      
      <div className="grid gap-6">
        {casoActual.sospechosos.map((sospechoso, index) => (
          <div 
            key={sospechoso.id} 
            className="card-neu p-6 group relative overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-acento-azul/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-fondo-secundario flex items-center justify-center border border-fondo-borde group-hover:border-acento-azul/50 transition-colors">
                      <span className="text-acento-azul font-bold text-lg">{index + 1}</span>
                    </div>
                    <h4 className="text-xl font-bold text-texto-principal group-hover:text-acento-azul transition-colors">
                      {sospechoso.nombre}
                    </h4>
                  </div>
                  
                  <button
                    onClick={() => onProponer(sospechoso.id)}
                    disabled={proponiendo !== null || casoActual.resuelto}
                    data-guide={index === 0 ? 'investigar-acusar' : undefined}
                    className={`btn-glow px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg ${
                      proponiendo === sospechoso.id
                        ? 'bg-acento-azul/20 text-acento-azul ring-2 ring-acento-azul/20'
                        : 'bg-fondo-secundario text-texto-secundario hover:bg-acento-azul hover:text-white hover:shadow-acento-azul/20'
                    } ${casoActual.resuelto ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {proponiendo === sospechoso.id ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>ANALIZANDO...</span>
                      </div>
                    ) : (
                      'ACUSAR SUJETO'
                    )}
                  </button>
                </div>
                
                <p className="text-texto-secundario text-base mb-6 leading-relaxed bg-fondo-panel/30 p-4 rounded-lg border border-fondo-borde/30">
                  {sospechoso.descripcion}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {sospechoso.motivacion && (
                    <div className="p-4 bg-fondo-secundario/30 rounded-xl border border-fondo-borde/30 hover:border-acento-turquesa/20 transition-colors">
                      <div className="flex items-center gap-2 text-xs font-bold text-acento-turquesa mb-2 uppercase tracking-wider">
                        <Target className="w-3 h-3" /> Motivación
                      </div>
                      <div className="text-sm text-texto-principal/90">{sospechoso.motivacion}</div>
                    </div>
                  )}
                  
                  {sospechoso.alibi && (
                    <div className="p-4 bg-fondo-secundario/30 rounded-xl border border-fondo-borde/30 hover:border-acento-turquesa/20 transition-colors">
                      <div className="flex items-center gap-2 text-xs font-bold text-acento-azul mb-2 uppercase tracking-wider">
                        <Clock className="w-3 h-3" /> Coartada
                      </div>
                      <div className="text-sm text-texto-principal/90">{sospechoso.alibi}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PanelPistas: React.FC = () => {
  const { casoActual, pistasDescubiertas, descubrirPista } = useGameStore();
  
  if (!casoActual) return null;

  const pistasDisponibles = casoActual.pistas.filter(p => 
    pistasDescubiertas.includes(p.id) || p.relevancia === 'alta'
  );

  return (
    <div className="space-y-6 animate-slide-up" data-guide="investigar-panel-pistas">
      <div className="flex items-center justify-between mb-2" data-guide="investigar-pistas-header">
        <h3 className="text-2xl font-serif text-texto-principal flex items-center gap-3" data-guide="investigar-pistas-titulo">
          <Search className="w-6 h-6 text-acento-turquesa" />
          Evidencias Recolectadas
        </h3>
        
        <span className="text-sm text-texto-secundario bg-fondo-borde/50 backdrop-blur-sm px-3 py-1 rounded-full border border-fondo-borde/30">
          {pistasDisponibles.length}/{casoActual.pistas.length} disponibles
        </span>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {casoActual.pistas.map((pista, index) => {
          const descubierta = pistasDescubiertas.includes(pista.id);
          const disponible = descubierta || pista.relevancia === 'alta';
          
          return (
            <div 
              key={pista.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`p-5 rounded-xl transition-all duration-500 border relative overflow-hidden ${
                descubierta 
                  ? 'bg-acento-azul/5 border-acento-azul/30 shadow-lg shadow-acento-azul/5' 
                  : disponible
                  ? 'bg-fondo-panel/40 border-fondo-borde hover:border-acento-turquesa/40 hover:bg-fondo-panel/60 cursor-pointer group'
                  : 'bg-fondo-panel/20 border-fondo-borde/30 opacity-60 grayscale'
              }`}
            >
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${
                      pista.relevancia === 'alta' ? 'bg-red-500 shadow-red-500/50' :
                      pista.relevancia === 'media' ? 'bg-yellow-500 shadow-yellow-500/50' :
                      'bg-green-500 shadow-green-500/50'
                    }`} />
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      pista.relevancia === 'alta' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      pista.relevancia === 'media' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {pista.relevancia.toUpperCase()}
                    </span>
                    {!pista.confiable && (
                      <span className="text-[10px] font-bold tracking-wider bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">
                        DUDOSA
                      </span>
                    )}
                  </div>
                  
                  <h4 className={`text-lg font-bold mb-2 transition-colors ${
                    descubierta ? 'text-texto-principal' : 'text-texto-principal/70 group-hover:text-acento-turquesa'
                  }`}>
                    {pista.titulo}
                  </h4>
                </div>
                
                {!descubierta && disponible && (
                  <button
                    onClick={() => descubrirPista(pista.id)}
                    data-guide={index === 0 ? 'investigar-examinar-pista' : undefined}
                    className="px-3 py-1.5 text-xs font-bold bg-acento-azul/10 text-acento-azul rounded-lg hover:bg-acento-azul hover:text-white transition-all shadow-lg shadow-acento-azul/10 active:scale-95"
                  >
                    EXAMINAR
                  </button>
                )}
              </div>
              
              {descubierta ? (
                <p className="text-texto-secundario text-sm leading-relaxed animate-fade-in">
                  {pista.descripcion}
                </p>
              ) : disponible ? (
                <p className="text-texto-secundario/50 text-sm italic flex items-center gap-2 group-hover:text-acento-turquesa/70 transition-colors">
                  <Search className="w-3 h-3" />
                  Pista disponible para análisis...
                </p>
              ) : (
                <p className="text-texto-secundario/30 text-sm italic flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" />
                  Datos insuficientes
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-center gap-3 backdrop-blur-sm">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <p className="text-yellow-400 text-sm font-bold tracking-wide">ADVERTENCIA DE INTELIGENCIA</p>
          <p className="text-yellow-400/70 text-xs mt-0.5">
            La información puede ser manipulada. Verifique las fuentes antes de sacar conclusiones.
          </p>
        </div>
      </div>
    </div>
  );
};

const PanelAyudas: React.FC = () => {
  const { casoActual, ayudasUsadas, usarAyuda } = useGameStore();

  if (!casoActual) return null;

  return (
    <div className="space-y-6 animate-slide-up" data-guide="investigar-panel-ayudas">
      <div className="flex items-center justify-between mb-2" data-guide="investigar-ayudas-header">
        <h3 className="text-2xl font-serif text-texto-principal flex items-center gap-3" data-guide="investigar-ayudas-titulo">
          <HelpCircle className="w-6 h-6 text-acento-turquesa" />
          Herramientas de Investigación
        </h3>
        
        <span className="text-sm text-texto-secundario bg-fondo-borde/50 backdrop-blur-sm px-3 py-1 rounded-full border border-fondo-borde/30">
          {ayudasUsadas.length}/3 usadas
        </span>
      </div>
      
      <div className="grid gap-6">
        {(casoActual.ayudas || []).map((ayuda, index) => {
          const usada = ayudasUsadas.includes(ayuda.id);
          
          return (
            <div 
              key={ayuda.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className={`p-6 rounded-xl transition-all duration-300 border relative overflow-hidden ${
                usada
                  ? 'bg-fondo-panel/40 border-green-500/30 shadow-lg shadow-green-500/5'
                  : 'card-neu hover:border-acento-turquesa/50'
              }`}
            >
              {usada && <div className="absolute top-0 right-0 p-2 opacity-50"><CheckCircle className="w-16 h-16 text-green-500/10" /></div>}
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      usada 
                        ? 'bg-green-500/20 text-green-400 shadow-green-500/10' 
                        : 'bg-acento-turquesa/20 text-acento-turquesa shadow-acento-turquesa/10'
                    }`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-texto-principal">
                        {ayuda.nombre}
                      </h4>
                      <p className="text-texto-secundario text-sm mt-0.5">
                        {ayuda.descripcion}
                      </p>
                    </div>
                  </div>
                  
                  {!usada && ayudasUsadas.length < 3 && (
                    <button
                      onClick={() => usarAyuda(ayuda.id)}
                      data-guide={index === 0 ? 'investigar-usar-ayuda' : undefined}
                      className="mt-2 w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-acento-turquesa to-acento-azul text-fondo-principal font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-acento-azul/20 active:scale-95"
                    >
                      ACTIVAR HERRAMIENTA
                    </button>
                  )}
                  
                  {usada && (
                    <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-xl animate-fade-in relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-green-500/50" />
                      <div className="flex items-center gap-2 mb-2 text-green-400 text-sm font-bold tracking-wide uppercase">
                        <CheckCircle className="w-4 h-4" />
                        Resultado del análisis
                      </div>
                      <p className="text-texto-principal text-sm leading-relaxed font-medium">
                        {ayuda.resultado || "Análisis completado sin nueva información relevante."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-400 text-sm font-bold">RECURSOS LIMITADOS</p>
            <p className="text-blue-400/80 text-xs mt-1">
              Solo puedes usar 3 ayudas por caso. Elige sabiamente cuándo utilizarlas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableroInvestigacion: React.FC = () => {
  const {
    casoActual,
    pistasDescubiertas,
    ayudasUsadas,
    hipotesisActual,
    errores,
    descubrirPista,
    usarAyuda,
    proponerCulpable,
    setHipotesis,
    getTiempoTranscurrido,
    nuevoCaso
  } = useGameStore();

  const [cargandoCaso, setCargandoCaso] = useState(true);
  const [panelActivo, setPanelActivo] = useState<'sospechosos' | 'pistas' | 'ayudas'>('sospechosos');
  const [notas, setNotas] = useState('');
  const [proponiendo, setProponiendo] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ correcto: boolean; mensaje: string } | null>(null);
  const [estadisticasFinales, setEstadisticasFinales] = useState<any>(null);
  const [tiempoVisual, setTiempoVisual] = useState(getTiempoTranscurrido());
  const [cerrandoResultado, setCerrandoResultado] = useState(false);
  const [redirectPendiente, setRedirectPendiente] = useState<string | null>(null);
  const [confirmarCierreCaso, setConfirmarCierreCaso] = useState<null | 'abandonar'>(null);

  useEffect(() => {
    if (casoActual) {
      setCargandoCaso(false);
      return;
    }

    const t = setTimeout(() => {
      setCargandoCaso(false);
    }, 1200);

    return () => clearTimeout(t);
  }, [casoActual]);

  // Cargar notas guardadas al iniciar
  useEffect(() => {
    const notasGuardadas = localStorage.getItem('notas-investigacion');
    if (notasGuardadas) {
      setNotas(notasGuardadas);
    }
  }, []);

  // Actualizar tiempo cada segundo
  useEffect(() => {
    setTiempoVisual(getTiempoTranscurrido());

    const timer = setInterval(() => {
      if (casoActual) {
        setTiempoVisual(getTiempoTranscurrido());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [casoActual, getTiempoTranscurrido]);

  // Guardar notas cuando cambien
  useEffect(() => {
    localStorage.setItem('notas-investigacion', notas);
  }, [notas]);

  const cerrarResultadoYRedirigir = (url: string) => {
    setCerrandoResultado(true);
    setRedirectPendiente(url);
    setTimeout(() => {
      window.location.href = url;
    }, 260);
  };

  const marcarCasoComoCerradoEnStore = () => {
    try {
      useGameStore.setState((state: any) => ({
        casoActual: state.casoActual ? { ...state.casoActual, resuelto: true } : null,
      }));
    } catch {
      // ignore
    }
  };

  const registrarCasoEnHistorial = (payload: any) => {
    const historialActual = JSON.parse(localStorage.getItem('historial-casos') || '[]');
    localStorage.setItem('historial-casos', JSON.stringify([...historialActual, payload]));
  };

  if (cargandoCaso && !casoActual) {
    return (
      <div className="min-h-screen bg-fondo-principal flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <h2 className="text-3xl font-serif text-texto-principal mb-3">Cargando...</h2>
          <p className="text-texto-secundario text-base mb-6 leading-relaxed">Preparando el tablero de investigación.</p>
          <div className="flex items-center justify-center gap-3 text-texto-secundario">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-mono tracking-wide">Procesando</span>
          </div>
        </div>
      </div>
    );
  }

  if (!casoActual) {
    return (
      <div className="min-h-screen bg-fondo-principal flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <AlertCircle className="w-20 h-20 mx-auto text-acento-azul mb-6 opacity-80" />
          <h2 className="text-3xl font-serif text-texto-principal mb-4">
            Expediente no encontrado
          </h2>
          <p className="text-texto-secundario text-lg mb-8 leading-relaxed">
            No hay un caso activo para investigar. 
            Comienza una nueva investigación para explorar un misterio único.
          </p>
          <a 
            href="/nuevo-caso"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-acento-azul to-acento-turquesa text-fondo-principal font-medium rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            <span className="text-lg">Generar nuevo caso</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  const pistasDisponibles = casoActual.pistas.filter(p => 
    pistasDescubiertas.includes(p.id) || p.relevancia === 'alta'
  );

  const porcentajeProgreso = Math.min(
    ((pistasDescubiertas.length + ayudasUsadas.length) / (casoActual.pistas.length + 3)) * 100,
    100
  );

  const tiempoTranscurrido = getTiempoTranscurrido();

  const generarPDF = () => {
    if (!casoActual) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Función para añadir marca de agua/header
    const agregarMarcaDeAgua = (pagina: number) => {
      doc.setPage(pagina);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("CONFIDENCIAL - SOLO USO OFICIAL", 10, 10);
      doc.text(`EXPEDIENTE: ${casoActual.id.substring(0, 8).toUpperCase()}`, pageWidth - 60, 10);
      doc.setDrawColor(200, 200, 200);
      doc.line(10, 15, pageWidth - 10, 15);
      doc.text(`Página ${pagina}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    };

    // Helper para verificar salto de página
    let yPos = 40;
    
    const checkPageBreak = (heightNeeded: number = 20) => {
      if (yPos + heightNeeded > pageHeight - 20) {
        agregarMarcaDeAgua(doc.getNumberOfPages());
        doc.addPage();
        yPos = 30;
      }
    };

    const addText = (text: string, fontSize: number = 11, fontStyle: string = "normal", indent: number = 20) => {
       doc.setFont("helvetica", fontStyle);
       doc.setFontSize(fontSize);
       doc.setTextColor(0, 0, 0);
       
       const lines = doc.splitTextToSize(text, pageWidth - (indent * 2));
       const lineHeight = fontSize * 0.5; // Aproximado
       
       lines.forEach((line: string) => {
         checkPageBreak(lineHeight);
         doc.text(line, indent, yPos);
         yPos += lineHeight + 2;
       });
       
       yPos += 5; // Margen extra después del bloque
    };

    // --- PÁGINA 1: PORTADA Y RESUMEN ---
    
    // Título Principal
    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(casoActual.titulo, pageWidth / 2, yPos, { align: "center" });
    yPos += 15;
    
    // Sello Top Secret
    doc.setTextColor(200, 0, 0);
    doc.setFontSize(14);
    doc.text("[ TOP SECRET ]", pageWidth / 2, yPos, { align: "center" });
    doc.setDrawColor(200, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(pageWidth / 2 - 20, yPos - 5, 40, 7);
    yPos += 20;
    
    // Detalles del Caso
    doc.setTextColor(0, 0, 0);
    
    addText("RESUMEN DE LOS HECHOS:", 12, "bold", 20);
    addText(casoActual.historia, 11, "normal", 20);
    
    yPos += 5;
    addText("AMBIENTACION:", 12, "bold", 20);
    addText(casoActual.ambientacion, 11, "normal", 20);
    
    yPos += 10;
    checkPageBreak(40);
    addText("INSTRUCCIONES PARA LOS AGENTES:", 12, "bold", 20);
    addText("1. Analicen los perfiles de los sospechosos y sus coartadas.", 11, "normal", 25);
    addText("2. Utilicen la interfaz táctica para revisar evidencias y solicitar análisis.", 11, "normal", 25);
    addText("3. Identifiquen al culpable basándose en hechos y contradicciones.", 11, "normal", 25);
    
    agregarMarcaDeAgua(1);

    // --- PÁGINA 2+: SOSPECHOSOS ---
    doc.addPage();
    yPos = 30;
    
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("PERFILES DE SOSPECHOSOS", 20, yPos);
    yPos += 20;
    
    casoActual.sospechosos.forEach((sospechoso, index) => {
      // Estimar altura necesaria para cada sospechoso (simplificado)
      const descLines = doc.splitTextToSize(sospechoso.descripcion, pageWidth - 50).length;
      const heightNeeded = 50 + (descLines * 7);
      
      checkPageBreak(heightNeeded);
      
      // Dibujar caja
      const startY = yPos;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);
      // No dibujamos el rect hasta saber la altura real final, o lo hacemos simple
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`SUJETO #${index + 1}: ${sospechoso.nombre.toUpperCase()}`, 25, yPos + 5);
      yPos += 15;
      
      addText(`Descripción:`, 10, "bold", 25);
      // Retrocedemos un poco para que la descripción quede alineada o seguimos abajo
      // Simplificado: title then text
      // doc.text was handled by addText but it adds newlines.
      // Re-implementing specific layout for suspects safely:
      
      const descSplit = doc.splitTextToSize(sospechoso.descripcion, pageWidth - 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      descSplit.forEach((line: string) => {
        checkPageBreak(5);
        doc.text(line, 25, yPos);
        yPos += 5;
      });
      
      yPos += 5;
      
      if (sospechoso.motivacion) {
        checkPageBreak(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Motivo Potencial:`, 25, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(sospechoso.motivacion, 56, yPos); // Offset x
        yPos += 7;
      }
      
      if (sospechoso.alibi) {
        checkPageBreak(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Coartada:`, 25, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(sospechoso.alibi, 56, yPos);
        yPos += 7;
      }
      
      // Rectángulo alrededor (approximado al final)
      doc.rect(20, startY, pageWidth - 40, yPos - startY + 2);
      yPos += 10;
    });
    
    agregarMarcaDeAgua(doc.getNumberOfPages());
    
    // --- PÁGINA 3+: EVIDENCIA ---
    doc.addPage();
    yPos = 30;
    
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("EVIDENCIA INICIAL RECOLECTADA", 20, yPos);
    yPos += 15;
    
    const evidenciasIniciales = casoActual.pistas.filter(p => p.relevancia === 'alta' || pistasDescubiertas.includes(p.id));
    
    evidenciasIniciales.forEach((pista, index) => {
       checkPageBreak(30); // Min height
       
       doc.setFont("helvetica", "bold");
       doc.setFontSize(11);
       doc.text(`EVIDENCIA #${index + 1}: ${pista.titulo}`, 20, yPos);
       yPos += 7;
       
       doc.setFont("helvetica", "normal"); 
       const descPista = doc.splitTextToSize(pista.descripcion, pageWidth - 50);
       
       descPista.forEach((line: string) => {
         checkPageBreak(5);
         doc.text(line, 20, yPos);
         yPos += 5;
       });
       
       yPos += 10;
    });
    
    agregarMarcaDeAgua(doc.getNumberOfPages());
    
    doc.save(`Caso_${casoActual.titulo}.pdf`);
  };

  const handleProponerCulpable = (sospechosoId: string) => {
    setProponiendo(sospechosoId);
    
    setTimeout(() => {
      const esCorrecto = proponerCulpable(sospechosoId);
      const culpable = casoActual?.sospechosos?.find(s => s.id === casoActual?.culpableId);
      
      // Calcular estadísticas
      const stats = {
          tiempoTotal: getTiempoTranscurrido(),
          erroresCometidos: errores + (esCorrecto ? 0 : 1),
          ayudasUtilizadas: ayudasUsadas.length,
          puntaje: Math.max(0, 100 - (errores * 15) - (ayudasUsadas.length * 10))
      };
      setEstadisticasFinales(stats);

      setResultado({
        correcto: esCorrecto,
        mensaje: esCorrecto 
          ? '¡Correcto! Has resuelto el caso. El culpable ha sido identificado.' 
          : `Acusación incorrecta. El culpable era ${culpable?.nombre || 'un sujeto no identificado'}. Logró salirse con la suya.`
      });
      
      setProponiendo(null);
      
      if (!casoActual) return;

      if (!esCorrecto) {
        marcarCasoComoCerradoEnStore();
        registrarCasoEnHistorial({
          casoId: casoActual.id,
          titulo: casoActual.titulo,
          fecha: new Date().toISOString(),
          resuelto: false,
          estado: 'fallido',
          culpable: culpable?.nombre,
          tiempo: getTiempoTranscurrido(),
          stats: { ...stats, puntaje: 0, fallido: true },
          data: casoActual
        });
      } else {
        registrarCasoEnHistorial({
          casoId: casoActual.id,
          titulo: casoActual.titulo,
          fecha: new Date().toISOString(),
          resuelto: true,
          estado: 'resuelto',
          culpable: culpable?.nombre,
          tiempo: getTiempoTranscurrido(),
          stats: stats,
          data: casoActual
        });
      }
    }, 1500);
  };



  return (
    <div className="min-h-screen bg-fondo-principal bg-grid-pattern relative overflow-hidden animate-fade-in">
       <div className="absolute inset-0 bg-gradient-radial from-transparent to-fondo-principal/90 pointer-events-none" />
       
      {/* Header */}
      <div className="bg-fondo-principal/80 backdrop-blur-xl border-b border-fondo-borde/50 sticky top-0 z-50 transition-all duration-300 shadow-2xl shadow-black/20">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-acento-azul/50 to-transparent animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 group">
                 <div className="bg-gradient-to-br from-acento-azul to-acento-turquesa p-2 rounded-xl text-fondo-principal shadow-lg shadow-acento-azul/20 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6" />
                 </div>
                 <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-texto-principal tracking-tight group-hover:text-acento-turquesa transition-colors">
                      {casoActual.titulo}
                    </h1>
                     <p className="text-sm text-texto-secundario italic flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-acento-turquesa animate-pulse"></span>
                       {casoActual.ambientacion}
                     </p>
                 </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-fondo-panel/50 border border-fondo-borde rounded-lg shadow-inner backdrop-blur-sm">
                <Clock className="w-4 h-4 text-acento-turquesa animate-spin-slow" />
                <span className="font-mono text-texto-principal font-bold tracking-widest">{tiempoTranscurrido}</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-fondo-panel/50 border border-fondo-borde rounded-lg shadow-inner backdrop-blur-sm">
                <Search className="w-4 h-4 text-acento-azul" />
                <span className="font-mono text-texto-principal font-bold">{pistasDescubiertas.length}/{casoActual.pistas.length}</span>
              </div>

               <button
                onClick={generarPDF}
                data-guide="investigar-legajo"
                className="flex items-center gap-2 px-4 py-2 bg-fondo-secundario hover:bg-acento-azul/10 border border-fondo-borde hover:border-acento-azul/30 rounded-lg text-texto-secundario hover:text-acento-azul transition-all duration-300 group ml-2 active:scale-95"
                title="Descargar Expediente"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                <span className="text-sm font-medium hidden sm:inline">Expediente PDF</span>
              </button>
            </div>
          </div>
          
          {/* Navegación Tabs */}
          <div className="flex space-x-6 mt-6 border-b border-fondo-borde/30 px-2 overflow-x-auto no-scrollbar" data-guide="investigar-tabs">
            {['sospechosos', 'pistas', 'ayudas'].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setPanelActivo(tab as any)}
                  data-guide={`investigar-tab-${tab}`}
                  className={`pb-3 flex items-center gap-2 transition-all text-sm font-medium border-b-2 whitespace-nowrap px-4 py-2 rounded-t-lg ${
                    panelActivo === tab
                      ? 'text-acento-azul border-acento-azul bg-acento-azul/5'
                      : 'text-texto-secundario border-transparent hover:text-texto-principal hover:bg-white/5'
                  }`}
                >
                  {tab === 'sospechosos' && <Users className="w-4 h-4" />}
                  {tab === 'pistas' && <Search className="w-4 h-4" />}
                  {tab === 'ayudas' && <HelpCircle className="w-4 h-4" />}
                  <span className="capitalize tracking-wide">{tab}</span>
                  {tab !== 'sospechosos' && (
                    <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${panelActivo === tab ? 'bg-acento-azul/20 text-acento-azul' : 'bg-fondo-borde text-texto-secundario'}`}>
                        {tab === 'pistas' ? pistasDisponibles.length : `${ayudasUsadas.length}/3`}
                    </span>
                  )}
               </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Panel izquierdo - Historia y contenido dinámico */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resumen del caso */}
            <div className="card-neu p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <FileText className="w-32 h-32 text-acento-turquesa transformer -rotate-12" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-acento-turquesa/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-acento-turquesa" />
                </div>
                <h2 className="text-xl font-serif text-texto-principal tracking-wide">
                  Resumen del Caso
                </h2>
              </div>
              <div className="prose prose-invert max-w-none relative z-10">
                <p className="text-texto-secundario leading-relaxed text-lg font-light">
                  {casoActual.historia}
                </p>
              </div>
            </div>

            {/* Panel dinámico */}
            <div className="min-h-[500px]">
              {panelActivo === 'sospechosos' && <PanelSospechosos proponiendo={proponiendo} onProponer={handleProponerCulpable} />}
              {panelActivo === 'pistas' && <PanelPistas />}
              {panelActivo === 'ayudas' && <PanelAyudas />}
            </div>
          </div>

          {/* Panel derecho - Herramientas y progreso - Sticky */}
          <div className="space-y-8 lg:sticky lg:top-32 self-start animate-fade-in" style={{ animationDelay: '300ms' }}>
            {/* Progreso */}
            <div className="card-neu p-6">
              <h3 className="text-lg font-serif text-texto-principal mb-6 flex items-center gap-2">
                 <Target className="w-5 h-5 text-acento-azul" />
                 Estado de la Misión
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-texto-secundario">Progreso de Investigación</span>
                    <span className="text-acento-azul">
                      {Math.round(porcentajeProgreso)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-fondo-borde/50 rounded-full overflow-hidden backdrop-blur-sm border border-fondo-borde/30">
                    <div 
                      className="h-full bg-gradient-to-r from-acento-azul via-acento-turquesa to-acento-azul background-animate rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${porcentajeProgreso}%`, backgroundSize: '200% 100%' }}
                    >
                        <div className="absolute top-0 right-0 w-1 bg-white/50 blur-[2px]" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-fondo-secundario/40 rounded-xl border border-fondo-borde/50 text-center hover:border-red-400/30 transition-colors">
                    <div className="text-xs text-texto-secundario mb-1 uppercase tracking-wider">Errores</div>
                    <div className="text-2xl text-texto-principal font-bold font-mono">
                      {errores}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-fondo-secundario/40 rounded-xl border border-fondo-borde/50 text-center hover:border-blue-400/30 transition-colors">
                    <div className="text-xs text-texto-secundario mb-1 uppercase tracking-wider">Ayudas</div>
                    <div className="text-2xl text-texto-principal font-bold font-mono">
                      {ayudasUsadas.length}<span className="text-sm text-texto-secundario font-normal">/3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hipótesis */}
            <div className="card-neu p-6 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-acento-azul via-acento-turquesa to-acento-azul animate-slide-up opacity-50" />
              
              <h3 className="text-lg font-serif text-texto-principal mb-4 flex items-center gap-2 relative z-10">
                <MessageSquare className="w-5 h-5 text-acento-turquesa" />
                Hipótesis
              </h3>
              
              <textarea
                value={hipotesisActual || ''}
                onChange={(e) => setHipotesis(e.target.value)}
                placeholder="Escribe tu teoría aquí... (Documento Confidencial)"
                data-guide="investigar-hipotesis"
                className="w-full h-32 bg-fondo-secundario/50 border border-fondo-borde rounded-xl p-4 text-texto-principal text-sm focus:outline-none focus:border-acento-azul resize-none placeholder:text-texto-secundario/30 transition-all focus:ring-2 focus:ring-acento-azul/10 relative z-10"
              />
              
              <div className="mt-4 text-[10px] text-texto-secundario/50 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 SOLO OJOS AUTORIZADOS
              </div>
            </div>

            {/* Notas */}
            <div className="card-neu p-6">
              <h3 className="text-lg font-serif text-texto-principal mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-acento-azul" />
                Notas de Campo
              </h3>
              
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Observaciones..."
                data-guide="investigar-notas"
                className="w-full h-40 bg-fondo-secundario/50 border border-fondo-borde rounded-xl p-4 text-texto-principal text-sm focus:outline-none focus:border-acento-azul resize-none placeholder:text-texto-secundario/30 transition-all focus:ring-2 focus:ring-acento-azul/10"
              />
            </div>

            {/* Acciones */}
            <div className="card-neu p-6 space-y-4">
              <a 
                href="/nuevo-caso"
                className="block w-full py-3 bg-fondo-secundario/50 border border-fondo-borde rounded-xl text-texto-principal text-center hover:border-acento-azul/50 hover:bg-fondo-secundario transition-all duration-300 font-medium text-sm group"
              >
                <span className="group-hover:text-acento-azul transition-colors">Generar Nuevo Caso</span>
              </a>

              <button
                onClick={() => {
                  window.location.href = '/archivo';
                }}
                className="block w-full py-3 bg-fondo-secundario/30 border border-fondo-borde rounded-xl text-texto-secundario text-center hover:border-acento-turquesa/40 hover:text-acento-turquesa transition-all duration-300 font-medium text-sm"
              >
                Resolver más tarde
              </button>
              
              <button
                onClick={() => {
                  setConfirmarCierreCaso('abandonar');
                }}
                className="block w-full py-3 bg-red-500/5 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-300 font-medium text-sm"
              >
                Abandonar Investigación
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmarCierreCaso === 'abandonar' && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-gradient-to-br from-fondo-panel via-fondo-panel to-fondo-secundario border border-fondo-borde/60 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-fondo-borde/40 bg-fondo-secundario/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-mono tracking-[0.28em] text-acento-azul/80 uppercase">
                    EXPEDIENTE CONFIDENCIAL
                  </div>
                  <h3 className="text-2xl font-serif text-texto-principal mt-2">
                    Cerrar investigación
                  </h3>
                </div>
                <button
                  onClick={() => setConfirmarCierreCaso(null)}
                  className="h-10 w-10 rounded-xl border border-fondo-borde/50 text-texto-secundario hover:text-texto-principal hover:bg-white/5 transition-colors"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-texto-secundario leading-relaxed">
                Si abandonás ahora, el caso quedará inconcluso.
              </p>
              <div className="mt-4 p-4 rounded-xl bg-fondo-secundario/30 border border-fondo-borde/40">
                <div className="text-[11px] font-mono text-texto-secundario/70 tracking-widest uppercase">
                  Nota operativa
                </div>
                <div className="text-sm text-texto-principal mt-2">
                  Esta acción cerrará el expediente y lo registrará como abandonado.
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfirmarCierreCaso(null)}
                  className="py-3 rounded-xl border border-fondo-borde/60 bg-fondo-secundario/20 text-texto-principal hover:bg-white/5 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!casoActual) return;
                    const culpable = casoActual?.sospechosos?.find(s => s.id === casoActual?.culpableId);
                    marcarCasoComoCerradoEnStore();
                    registrarCasoEnHistorial({
                      casoId: casoActual.id,
                      titulo: casoActual.titulo,
                      fecha: new Date().toISOString(),
                      resuelto: false,
                      estado: 'abandonado',
                      culpable: culpable?.nombre,
                      tiempo: getTiempoTranscurrido(),
                      stats: { puntaje: 0, abandono: true },
                      data: casoActual
                    });
                    setConfirmarCierreCaso(null);
                    window.location.href = '/archivo';
                  }}
                  className="py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:shadow-lg hover:shadow-red-500/20 transition-shadow"
                >
                  Abandonar caso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resultado de propuesta */}
      {resultado && (
        <div className={`fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-lg ${cerrandoResultado ? 'opacity-0 transition-opacity duration-200' : 'animate-fade-in'}`}>
          <div className={`max-w-md w-full rounded-2xl p-8 transform transition-all duration-500 animate-scale-in relative overflow-hidden ${
            resultado.correcto 
              ? 'bg-gradient-to-br from-fondo-panel via-fondo-panel to-green-900/10 border border-green-500/30' 
              : 'bg-gradient-to-br from-fondo-panel via-fondo-panel to-red-900/10 border border-red-500/30'
          } shadow-2xl`}>
            
            {/* Background effects in modal */}
            <div className={`absolute top-0 left-0 w-full h-1 ${resultado.correcto ? 'bg-green-500' : 'bg-red-500'}`} />
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${resultado.correcto ? 'bg-green-500' : 'bg-red-500'}`} />

            <div className="text-center relative z-10">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border-4 ${
                resultado.correcto 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              }`}>
                {resultado.correcto ? (
                  <CheckCircle className="w-12 h-12 animate-pulse-slow" />
                ) : (
                  <XCircle className="w-12 h-12" />
                )}
              </div>
              
              <h3 className={`text-3xl font-serif font-bold mb-3 ${resultado.correcto ? 'text-green-400' : 'text-red-400'}`}>
                {resultado.correcto ? '¡MISION CUMPLIDA!' : 'FALLO DE ANALISIS'}
              </h3>
              
              <p className="text-texto-secundario mb-8 text-lg font-light leading-relaxed">
                {resultado.mensaje}
              </p>

              {resultado.correcto && estadisticasFinales && (
                  <div className="mb-8 bg-fondo-secundario/50 rounded-xl p-5 border border-fondo-borde/50">
                    <h4 className="text-xs font-bold text-texto-secundario mb-4 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Reporte Final</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                       <div className="flex flex-col items-start">
                         <span className="text-[10px] text-texto-secundario uppercase">Tiempo Op.</span>
                         <span className="text-lg font-mono text-texto-principal">{estadisticasFinales.tiempoTotal}</span>
                       </div>
                       <div className="flex flex-col items-end">
                         <span className="text-[10px] text-texto-secundario uppercase">Puntaje</span>
                         <span className="text-2xl font-mono text-acento-turquesa font-bold drop-shadow-glow">{estadisticasFinales.puntaje}</span>
                       </div>
                       <div className="flex flex-col items-start">
                         <span className="text-[10px] text-texto-secundario uppercase">Errores</span>
                         <span className="text-base font-mono text-red-400">{estadisticasFinales.erroresCometidos}</span>
                       </div>
                       <div className="flex flex-col items-end">
                         <span className="text-[10px] text-texto-secundario uppercase">Ayudas</span>
                         <span className="text-base font-mono text-blue-400">{estadisticasFinales.ayudasUtilizadas}/3</span>
                       </div>
                    </div>
                  </div>
              )}
              
              
              <button
                onClick={() => {
                  if (redirectPendiente) return;
                  if (resultado.correcto) {
                    cerrarResultadoYRedirigir('/archivo');
                    return;
                  }
                  cerrarResultadoYRedirigir('/archivo');
                }}
                className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg hover:translate-y-[-2px] active:translate-y-[1px] ${
                    resultado.correcto 
                    ? 'bg-gradient-to-r from-green-600 to-green-500 shadow-green-500/20' 
                    : 'bg-fondo-secundario border border-white/5 hover:bg-white/5'
                }`}
              >
                {resultado.correcto ? 'ARCHIVAR CASO' : 'ARCHIVAR INFORME'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default TableroInvestigacion;