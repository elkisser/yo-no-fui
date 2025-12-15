import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { jsPDF } from 'jspdf';
import { 
  Search, 
  FileText, 
  Users, 
  AlertCircle, 
  HelpCircle,
  Target,
  Clock,
  ChevronRight,
  CheckCircle,
  XCircle,
  BookOpen,
  MessageSquare,
  Zap,
  ArrowRight,
  Loader2,
  Download
} from 'lucide-react';

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

  const [panelActivo, setPanelActivo] = useState<'sospechosos' | 'pistas' | 'ayudas'>('sospechosos');
  const [notas, setNotas] = useState('');
  const [proponiendo, setProponiendo] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ correcto: boolean; mensaje: string } | null>(null);
  const [tiempoVisual, setTiempoVisual] = useState(getTiempoTranscurrido());
  const [estadisticasFinales, setEstadisticasFinales] = useState<any>(null);

  // Cargar notas guardadas al iniciar
  useEffect(() => {
    const notasGuardadas = localStorage.getItem('notas-investigacion');
    if (notasGuardadas) {
      setNotas(notasGuardadas);
    }
  }, []);

  // Actualizar tiempo cada segundo
  useEffect(() => {
    // Actualización inicial
    setTiempoVisual(getTiempoTranscurrido());

    const timer = setInterval(() => {
      if (casoActual) {
        setTiempoVisual(getTiempoTranscurrido());
      }
    }, 1000); // Actualizar cada segundo
    
    return () => clearInterval(timer);
  }, [casoActual, getTiempoTranscurrido]);

  // Guardar notas cuando cambien
  useEffect(() => {
    localStorage.setItem('notas-investigacion', notas);
  }, [notas]);

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

    // --- PÁGINA 1: PORTADA Y RESUMEN ---
    
    // Título Principal
    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(casoActual.titulo, pageWidth / 2, 40, { align: "center" });
    
    // Sello Top Secret
    doc.setTextColor(200, 0, 0);
    doc.setFontSize(14);
    doc.text("[ TOP SECRET ]", pageWidth / 2, 50, { align: "center" });
    doc.setDrawColor(200, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(pageWidth / 2 - 20, 45, 40, 7);
    
    // Detalles del Caso
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    let yPos = 70;
    doc.text("RESUMEN DE LOS HECHOS:", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    const splitHistoria = doc.splitTextToSize(casoActual.historia, pageWidth - 40);
    doc.text(splitHistoria, 20, yPos);
    
    yPos += (splitHistoria.length * 7) + 15;
    
    doc.setFont("helvetica", "bold");
    doc.text("AMBIENTACION:", 20, yPos);
    doc.setFont("helvetica", "normal");
    const splitAmbientacion = doc.splitTextToSize(casoActual.ambientacion, pageWidth - 80);
    doc.text(splitAmbientacion, 60, yPos);
    
    yPos += 30;
    
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUCCIONES PARA LOS AGENTES:", 20, yPos);
    yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.text("1. Analicen los perfiles de los sospechosos en la siguiente página.", 25, yPos);
    yPos += 7;
    doc.text("2. Utilicen la app web para solicitar análisis forenses (Ayudas).", 25, yPos);
    yPos += 7;
    doc.text("3. Verifiquen coartadas y motiven sus conclusiones.", 25, yPos);
    
    agregarMarcaDeAgua(1);

    // --- PÁGINA 2: SOSPECHOSOS ---
    doc.addPage();
    yPos = 30;
    
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("PERFILES DE SOSPECHOSOS", 20, yPos);
    yPos += 15;
    
    casoActual.sospechosos.forEach((sospechoso, index) => {
      // Verificar espacio en página
      if (yPos > pageHeight - 50) {
    agregarMarcaDeAgua(doc.getNumberOfPages());
        doc.addPage();
        yPos = 30;
      }
      
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);
      doc.rect(20, yPos, pageWidth - 40, 45);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`SUJETO #${index + 1}: ${sospechoso.nombre.toUpperCase()}`, 25, yPos + 10);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      doc.text(`Descripción:`, 25, yPos + 20);
      const descSplit = doc.splitTextToSize(sospechoso.descripcion, pageWidth - 70);
      doc.text(descSplit, 50, yPos + 20);
      
      const nextLine = yPos + 20 + (descSplit.length * 5);
      
      if (sospechoso.motivacion) {
        doc.text(`Motivo Potencial:`, 25, nextLine);
        doc.text(sospechoso.motivacion, 55, nextLine);
      }
      
      if (sospechoso.alibi) {
        doc.text(`Coartada:`, 25, nextLine + 7);
        doc.text(sospechoso.alibi, 55, nextLine + 7);
      }
      
      yPos += 55;
    });
    
    agregarMarcaDeAgua(doc.getNumberOfPages());
    
    // --- PÁGINA 3: EVIDENCIA INICIAL ---
    doc.addPage();
    yPos = 30;
    
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("EVIDENCIA INICIAL RECOLECTADA", 20, yPos);
    yPos += 15;
    
    // Filtrar solo evidencia inicial (descubierta o alta relevancia)
    const evidenciasIniciales = casoActual.pistas.filter(p => p.relevancia === 'alta' || pistasDescubiertas.includes(p.id));
    
    evidenciasIniciales.forEach((pista, index) => {
       doc.setFont("helvetica", "bold");
       doc.setFontSize(11);
       doc.text(`EVIDENCIA #${index + 1}: ${pista.titulo}`, 20, yPos);
       
       doc.setFont("helvetica", "normal"); 
       const descPista = doc.splitTextToSize(pista.descripcion, pageWidth - 50);
       doc.text(descPista, 20, yPos + 7);
       
       yPos += 20 + (descPista.length * 5);
    });
    
    agregarMarcaDeAgua(doc.getNumberOfPages());
    
    doc.save(`Caso_${casoActual.titulo}.pdf`);
  };

  const handleProponerCulpable = (sospechosoId: string) => {
    setProponiendo(sospechosoId);
    
    setTimeout(() => {
      const esCorrecto = proponerCulpable(sospechosoId);
      
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
          : 'Incorrecto. Este sospechoso no es el culpable. Sigue investigando.'
      });
      
      setProponiendo(null);
      
      if (!esCorrecto) {
        setTimeout(() => {
          setResultado(null);
        }, 3000);
      } else {
        // Guardar en historial (localStorage para persistencia simple entre sesiones)
        const historialActual = JSON.parse(localStorage.getItem('historial-casos') || '[]');
        const nuevoRegistro = {
          casoId: casoActual.id,
          titulo: casoActual.titulo,
          fecha: new Date().toISOString(),
          resuelto: true,
          tiempo: getTiempoTranscurrido(),
          stats: stats,
          data: casoActual
        };
        
        localStorage.setItem('historial-casos', JSON.stringify([...historialActual, nuevoRegistro]));
        
        // Esperar para ver las estadísticas y luego limpiar/redirigir
        setTimeout(() => {
           nuevoCaso(); // Limpiar el caso actual del store
           window.location.href = '/archivo';
        }, 10000);
      }
    }, 1500);
  };

  const PanelSospechosos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-serif text-texto-principal flex items-center gap-3">
          <Users className="w-6 h-6 text-acento-azul" />
          Perfiles de Sospechosos
        </h3>
        <span className="text-sm text-texto-secundario bg-fondo-borde px-3 py-1 rounded-full">
          {casoActual.sospechosos.length} registros
        </span>
      </div>
      
      <div className="space-y-4">
        {casoActual.sospechosos.map((sospechoso) => (
          <div 
            key={sospechoso.id} 
            className="bg-fondo-panel/50 border border-fondo-borde rounded-xl p-5 hover:border-acento-azul/30 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-semibold text-texto-principal group-hover:text-acento-azul transition-colors">
                    {sospechoso.nombre}
                  </h4>
                  <button
                    onClick={() => handleProponerCulpable(sospechoso.id)}
                    disabled={proponiendo !== null || casoActual.resuelto}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      proponiendo === sospechoso.id
                        ? 'bg-acento-azul/20 text-acento-azul'
                        : 'bg-fondo-borde text-texto-secundario hover:bg-acento-azul/10 hover:text-acento-azul'
                    } ${casoActual.resuelto ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {proponiendo === sospechoso.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Proponer como culpable'
                    )}
                  </button>
                </div>
                
                <p className="text-texto-secundario text-sm mb-3 leading-relaxed">
                  {sospechoso.descripcion}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {sospechoso.motivacion && (
                    <div className="p-3 bg-fondo-secundario/30 rounded-lg">
                      <div className="text-xs text-texto-secundario mb-1">Motivación</div>
                      <div className="text-sm text-texto-principal">{sospechoso.motivacion}</div>
                    </div>
                  )}
                  
                  {sospechoso.alibi && (
                    <div className="p-3 bg-fondo-secundario/30 rounded-lg">
                      <div className="text-xs text-texto-secundario mb-1">Coartada</div>
                      <div className="text-sm text-texto-principal">{sospechoso.alibi}</div>
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

  const PanelPistas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-serif text-texto-principal flex items-center gap-3">
          <Search className="w-6 h-6 text-acento-turquesa" />
          Evidencias Recolectadas
        </h3>
        <span className="text-sm text-texto-secundario bg-fondo-borde px-3 py-1 rounded-full">
          {pistasDisponibles.length}/{casoActual.pistas.length} disponibles
        </span>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {casoActual.pistas.map((pista) => {
          const descubierta = pistasDescubiertas.includes(pista.id);
          const disponible = descubierta || pista.relevancia === 'alta';
          
          return (
            <div 
              key={pista.id}
              className={`border rounded-xl p-4 transition-all duration-300 ${
                descubierta 
                  ? 'border-acento-azul/50 bg-acento-azul/5' 
                  : disponible
                  ? 'border-fondo-borde bg-fondo-panel/30 hover:border-acento-turquesa/30'
                  : 'border-fondo-borde/50 bg-fondo-panel/10 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      pista.relevancia === 'alta' ? 'bg-red-400' :
                      pista.relevancia === 'media' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`} />
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      pista.relevancia === 'alta' ? 'bg-red-400/10 text-red-400' :
                      pista.relevancia === 'media' ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-green-400/10 text-green-400'
                    }`}>
                      {pista.relevancia.toUpperCase()}
                    </span>
                    {!pista.confiable && (
                      <span className="text-xs bg-orange-400/10 text-orange-400 px-2 py-1 rounded-full">
                        Dudosa
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-texto-principal mb-1">
                    {pista.titulo}
                  </h4>
                </div>
                
                {!descubierta && disponible && (
                  <button
                    onClick={() => descubrirPista(pista.id)}
                    className="px-3 py-1.5 text-xs bg-acento-azul/10 text-acento-azul rounded-lg hover:bg-acento-azul/20 transition-colors"
                  >
                    Examinar
                  </button>
                )}
              </div>
              
              {descubierta ? (
                <p className="text-texto-secundario text-sm leading-relaxed">
                  {pista.descripcion}
                </p>
              ) : disponible ? (
                <p className="text-texto-secundario/60 text-sm italic">
                  Pista disponible para examinar...
                </p>
              ) : (
                <p className="text-texto-secundario/40 text-sm italic">
                  Pista aún no disponible
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 text-sm font-medium">Nota importante</p>
            <p className="text-yellow-400/80 text-xs mt-1">
              No todas las pistas son confiables. Algunas pueden ser engañosas o contener información errónea.
              Analiza cada evidencia cuidadosamente y verifica su consistencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const PanelAyudas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-serif text-texto-principal flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-acento-turquesa" />
          Herramientas de Investigación
        </h3>
        <span className="text-sm text-texto-secundario bg-fondo-borde px-3 py-1 rounded-full">
          {ayudasUsadas.length}/3 usadas
        </span>
      </div>
      
      <div className="space-y-4">
        {(casoActual.ayudas || []).map((ayuda) => {
          const usada = ayudasUsadas.includes(ayuda.id);
          
          return (
            <div 
              key={ayuda.id}
              className={`border rounded-xl p-5 transition-all duration-300 ${
                usada
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-fondo-borde bg-fondo-panel/30 hover:border-acento-turquesa/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      usada 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-acento-turquesa/20 text-acento-turquesa'
                    }`}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-texto-principal">
                        {ayuda.nombre}
                      </h4>
                      <p className="text-texto-secundario text-sm mt-1">
                        {ayuda.descripcion}
                      </p>
                    </div>
                  </div>
                  
                  {!usada && ayudasUsadas.length < 3 && (
                    <button
                      onClick={() => usarAyuda(ayuda.id)}
                      className="mt-3 px-4 py-2 bg-gradient-to-r from-acento-turquesa to-acento-azul text-fondo-principal text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Usar herramienta
                    </button>
                  )}
                  
                  {usada && (
                    <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2 text-green-400 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Resultado del análisis
                      </div>
                      <p className="text-texto-principal text-sm leading-relaxed">
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
      
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-400 text-sm font-medium">Recursos limitados</p>
            <p className="text-blue-400/80 text-xs mt-1">
              Solo puedes usar 3 ayudas por caso. Elige sabiamente cuándo utilizarlas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-fondo-principal">
      {/* Header */}
      <div className="bg-fondo-principal/80 backdrop-blur-md border-b border-fondo-borde/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                 <div className="bg-gradient-to-br from-acento-azul to-acento-turquesa p-2 rounded-lg text-fondo-principal shadow-lg shadow-acento-azul/20">
                    <FileText className="w-6 h-6" />
                 </div>
                 <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-texto-principal tracking-tight">
                      {casoActual.titulo}
                    </h1>
                     <p className="text-sm text-texto-secundario italic flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-acento-turquesa"></span>
                       {casoActual.ambientacion}
                     </p>
                 </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-fondo-panel border border-fondo-borde rounded-md shadow-sm">
                <Clock className="w-4 h-4 text-acento-turquesa" />
                <span className="font-mono text-texto-principal font-medium">{tiempoTranscurrido}</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-fondo-panel border border-fondo-borde rounded-md shadow-sm">
                <Search className="w-4 h-4 text-acento-azul" />
                <span className="font-mono text-texto-principal font-medium">{pistasDescubiertas.length}/{casoActual.pistas.length}</span>
              </div>

               <button
                onClick={generarPDF}
                className="flex items-center gap-2 px-4 py-2 bg-fondo-secundario hover:bg-acento-azul/10 border border-fondo-borde hover:border-acento-azul/30 rounded-lg text-texto-secundario hover:text-acento-azul transition-all duration-300 group ml-2"
                title="Descargar Expediente"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Expediente PDF</span>
              </button>
            </div>
          </div>
          
          {/* Navegación Tabs */}
          <div className="flex space-x-6 mt-6 border-b border-fondo-borde/30 px-2 overflow-x-auto no-scrollbar">
            {['sospechosos', 'pistas', 'ayudas'].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setPanelActivo(tab as any)}
                  className={`pb-3 flex items-center gap-2 transition-all text-sm font-medium border-b-2 whitespace-nowrap px-1 ${
                    panelActivo === tab
                      ? 'text-acento-azul border-acento-azul'
                      : 'text-texto-secundario border-transparent hover:text-texto-principal hover:border-texto-secundario/30'
                  }`}
                >
                  {tab === 'sospechosos' && <Users className="w-4 h-4" />}
                  {tab === 'pistas' && <Search className="w-4 h-4" />}
                  {tab === 'ayudas' && <HelpCircle className="w-4 h-4" />}
                  <span className="capitalize">{tab}</span>
                  {tab !== 'sospechosos' && (
                    <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${panelActivo === tab ? 'bg-acento-azul/10' : 'bg-fondo-borde'}`}>
                        {tab === 'pistas' ? pistasDisponibles.length : `${ayudasUsadas.length}/3`}
                    </span>
                  )}
               </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Panel izquierdo - Historia y contenido dinámico */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resumen del caso */}
            <div className="bg-fondo-panel/30 border border-fondo-borde rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-acento-turquesa" />
                <h2 className="text-xl font-serif text-texto-principal">
                  Resumen del Caso
                </h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-texto-secundario leading-relaxed text-sm md:text-base">
                  {casoActual.historia}
                </p>
              </div>
            </div>

            {/* Panel dinámico */}
            <div className="bg-fondo-panel/30 border border-fondo-borde rounded-xl p-6">
              {panelActivo === 'sospechosos' && <PanelSospechosos />}
              {panelActivo === 'pistas' && <PanelPistas />}
              {panelActivo === 'ayudas' && <PanelAyudas />}
            </div>
          </div>

          {/* Panel derecho - Herramientas y progreso - Sticky */}
          <div className="space-y-8 lg:sticky lg:top-28 self-start">
            {/* Progreso */}
            <div className="bg-fondo-panel/30 border border-fondo-borde rounded-xl p-6">
              <h3 className="text-lg font-serif text-texto-principal mb-4">
                Progreso de la Investigación
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-texto-secundario">Completitud</span>
                    <span className="text-acento-azul font-medium">
                      {Math.round(porcentajeProgreso)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-fondo-borde rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-acento-azul to-acento-turquesa rounded-full transition-all duration-500"
                      style={{ width: `${porcentajeProgreso}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-fondo-secundario/30 rounded-lg">
                    <div className="text-xs text-texto-secundario mb-1">Errores</div>
                    <div className="text-lg text-texto-principal font-medium">
                      {errores}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-fondo-secundario/30 rounded-lg">
                    <div className="text-xs text-texto-secundario mb-1">Ayudas usadas</div>
                    <div className="text-lg text-texto-principal font-medium">
                      {ayudasUsadas.length}/3
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hipótesis */}
            <div className="bg-fondo-panel/30 border border-fondo-borde rounded-xl p-6">
              <h3 className="text-lg font-serif text-texto-principal mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Hipótesis Actual
              </h3>
              
              <textarea
                value={hipotesisActual || ''}
                onChange={(e) => setHipotesis(e.target.value)}
                placeholder="Escribe tu teoría sobre quién es el culpable y por qué..."
                className="w-full h-32 bg-fondo-secundario/30 border border-fondo-borde rounded-lg p-4 text-texto-principal text-sm focus:outline-none focus:border-acento-azul resize-none placeholder:text-texto-secundario/50"
              />
              
              <div className="mt-4 text-xs text-texto-secundario/70">
                Basa tu hipótesis en las pistas descubiertas y las relaciones entre sospechosos.
              </div>
            </div>

            {/* Notas */}
            <div className="bg-fondo-panel/30 border border-fondo-borde rounded-xl p-6">
              <h3 className="text-lg font-serif text-texto-principal mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Notas del Investigador
              </h3>
              
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Registra observaciones, conexiones, dudas..."
                className="w-full h-40 bg-fondo-secundario/30 border border-fondo-borde rounded-lg p-4 text-texto-principal text-sm focus:outline-none focus:border-acento-azul resize-none placeholder:text-texto-secundario/50"
              />
            </div>

            {/* Acciones */}
            <div className="bg-fondo-panel/30 border border-fondo-borde rounded-xl p-6">
              <h3 className="text-lg font-serif text-texto-principal mb-4">
                Acciones
              </h3>
              
              <div className="space-y-3">
                <a 
                  href="/nuevo-caso"
                  className="block w-full py-3 bg-fondo-secundario/50 border border-fondo-borde rounded-lg text-texto-principal text-center hover:border-acento-azul/50 transition-colors"
                >
                  Nuevo caso
                </a>
                
                <button
                  onClick={() => {
                   if (confirm('¿Seguro que quieres abandonar? El caso quedará registrado como no resuelto.')) {
                      const historialActual = JSON.parse(localStorage.getItem('historial-casos') || '[]');
                      const nuevoRegistro = {
                        casoId: casoActual.id,
                        titulo: casoActual.titulo,
                        fecha: new Date().toISOString(),
                        resuelto: false,
                        tiempo: getTiempoTranscurrido(),
                        stats: { puntaje: 0, abandono: true },
                        data: casoActual
                      };
                      localStorage.setItem('historial-casos', JSON.stringify([...historialActual, nuevoRegistro]));
                      
                      nuevoCaso();
                      window.location.href = '/';
                    }
                  }}
                  className="block w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Abandonar investigación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resultado de propuesta */}
      {resultado && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className={`max-w-md w-full rounded-xl p-6 transform transition-all duration-500 ${
            resultado.correcto 
              ? 'bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 shadow-2xl shadow-green-500/20' 
              : 'bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 shadow-2xl shadow-red-500/20'
          } bg-fondo-panel`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                resultado.correcto 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {resultado.correcto ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
              </div>
              
              <h3 className="text-2xl font-serif text-texto-principal mb-2">
                {resultado.correcto ? '¡Caso Resuelto!' : 'Hipótesis Incorrecta'}
              </h3>
              
              <p className="text-texto-secundario mb-6">
                {resultado.mensaje}
              </p>

              {resultado.correcto && estadisticasFinales && (
                  <div className="mb-6 bg-fondo-secundario/50 rounded-lg p-4 border border-fondo-borde">
                    <h4 className="text-sm font-bold text-texto-principal mb-3 uppercase tracking-wider">Estadísticas del Detective</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-left">
                        <span className="text-texto-secundario block text-xs">Tiempo</span>
                        <span className="font-mono text-texto-principal">{estadisticasFinales.tiempoTotal}</span>
                      </div>
                      <div className="text-left">
                         <span className="text-texto-secundario block text-xs">Puntaje</span>
                         <span className="font-mono text-acento-turquesa font-bold">{estadisticasFinales.puntaje}/100</span>
                      </div>
                       <div className="text-left">
                        <span className="text-texto-secundario block text-xs">Errores</span>
                        <span className="font-mono text-red-400">{estadisticasFinales.erroresCometidos}</span>
                      </div>
                      <div className="text-left">
                        <span className="text-texto-secundario block text-xs">Ayudas</span>
                        <span className="font-mono text-blue-400">{estadisticasFinales.ayudasUtilizadas}/3</span>
                      </div>
                    </div>
                  </div>
              )}
              
              {resultado.correcto && (
                <p className="text-sm text-green-400/80 mb-4 animate-pulse">
                  Redirigiendo al escritorio en 10 segundos...
                </p>
              )}
              
              <button
                onClick={() => setResultado(null)}
                className="px-6 py-2 bg-fondo-borde/80 text-texto-principal rounded-lg hover:bg-fondo-secundario transition-colors border border-fondo-borde w-full"
              >
                {resultado.correcto ? 'Continuar analizando' : 'Entendido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableroInvestigacion;