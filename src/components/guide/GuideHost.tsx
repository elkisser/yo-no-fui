import React, { useEffect, useMemo, useRef, useState } from 'react';

type GuideId = 'home' | 'nuevo-caso' | 'investigar' | 'archivo';

type GuideStep = {
  id: string;
  title: string;
  body: string;
  target: string;
  next?: { type: 'next' } | { type: 'end' };
  allowInteractionWithinTarget?: boolean;
  presentation?: 'spotlight' | 'modal';
  ensureVisible?: { click: string };
};

type ActiveGuideState = {
  guideId: GuideId;
  stepIndex: number;
};

const LS_ACTIVE = 'yo-no-fui-guide-active';
const LS_ONBOARDING_DONE = 'yo-no-fui-onboarding-done';
const LS_GUIDE_REQUEST = 'yo-no-fui-guide-request';
const GUIDE_EVENT = 'yo-no-fui:guide';

type GuideRequest =
  | { type: 'start'; guideId: GuideId; scope?: 'full' | 'section' }
  | { type: 'stop' };

const readJson = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const clearKey = (key: string) => {
  localStorage.removeItem(key);
};

const getGuideDefinitions = (): Record<GuideId, GuideStep[]> => {
  return {
    home: [
      {
        id: 'home.welcome',
        title: 'Expediente inicial',
        body: 'Un caso, una acusación. Antes de actuar: observa, recolecta y recién entonces firmá la orden.',
        target: '[data-guide="home-hero"]',
        next: { type: 'next' },
        presentation: 'modal',
      },
      {
        id: 'home.newcase',
        title: 'Abrir un caso',
        body: 'Desde aquí podés generar un expediente. Al cerrarlo, quedará archivado con su estado.',
        target: 'a[href="/nuevo-caso"]',
        next: { type: 'end' },
        allowInteractionWithinTarget: true,
      },
    ],
    'nuevo-caso': [
      {
        id: 'nuevo-caso.generator',
        title: 'Generador de caso',
        body: 'Configurá los parámetros y generá el caso. Elegí cómo querés jugar: rápido y fácil o más complejo y desafiante.',
        target: '[data-guide="nuevo-caso-root"]',
        next: { type: 'end' },
        presentation: 'modal',
      },
      {
        id: 'nuevo-caso.tema',
        title: 'Tipo de caso (tema)',
        body: 'Elegí el tema del caso. Si lo dejás en “Sorpréndeme”, la IA te arma uno aleatorio. Esto define el estilo de la historia.',
        target: '[data-guide="nuevo-caso-tema"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
      },
      {
        id: 'nuevo-caso.dificultad',
        title: 'Dificultad',
        body: 'El “Nivel de Amenaza” cambia la complejidad: más detalles, más ruido y más dificultad para decidir. Arrancá en Media si es tu primer caso.',
        target: '[data-guide="nuevo-caso-dificultad"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
      },
      {
        id: 'nuevo-caso.generar-ia',
        title: 'Generar con IA',
        body: 'Este botón crea un caso nuevo en tiempo real. Requiere conexión. Al terminar, te manda directo a investigar.',
        target: '[data-guide="nuevo-caso-generar-ia"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
      },
      {
        id: 'nuevo-caso.generar-offline',
        title: 'Modo Offline (sin IA)',
        body: 'Si no tenés conexión, podés iniciar una simulación offline. Es un caso precargado para poder jugar igual.',
        target: '[data-guide="nuevo-caso-generar-offline"]',
        next: { type: 'end' },
        allowInteractionWithinTarget: true,
      },
    ],
    investigar: [
      {
        id: 'investigar.tabs',
        title: 'Panel de investigación',
        body: 'Alterná entre sospechosos, evidencia y ayudas. Recordá: una acusación errada cierra el caso.',
        target: '[data-guide="investigar-tabs"]',
        next: { type: 'next' },
      },
      {
        id: 'investigar.sospechosos',
        title: 'Sospechosos',
        body: 'Acá están los perfiles. Leé motivación y coartada: tu trabajo es encontrar contradicciones con las evidencias.',
        target: '[data-guide="investigar-sospechosos-titulo"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
        ensureVisible: { click: '[data-guide="investigar-tab-sospechosos"]' },
      },
      {
        id: 'investigar.acusar',
        title: 'Acusar al culpable',
        body: 'Cuando estés seguro, usá “ACUSAR SUJETO”. Si acusás mal, el caso se cierra como fallido.',
        target: '[data-guide="investigar-acusar"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
        ensureVisible: { click: '[data-guide="investigar-tab-sospechosos"]' },
      },
      {
        id: 'investigar.legajo',
        title: 'Legajo (PDF)',
        body: 'Este botón genera el legajo del caso: resumen, sospechosos y evidencia inicial. Sirve para revisar offline o archivar.',
        target: '[data-guide="investigar-legajo"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
      },
      {
        id: 'investigar.hipotesis',
        title: 'Hipótesis',
        body: 'Escribí tu teoría. Te ayuda a ordenar hechos, descartar alternativas y no caer en sesgos por una pista llamativa.',
        target: '[data-guide="investigar-hipotesis"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
      },
      {
        id: 'investigar.pistas.tab',
        title: 'Pistas / evidencias',
        body: 'Cambiá a “pistas” para ver evidencias. Algunas están disponibles desde el inicio, otras aparecen cuando avanzás.',
        target: '[data-guide="investigar-tab-pistas"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
      },
      {
        id: 'investigar.pistas.panel',
        title: 'Analizar una pista',
        body: 'En esta sección tenés las evidencias. Tocá “EXAMINAR” en una pista disponible para ver el detalle completo. Mirá relevancia (alta/media/baja) y si es “DUDOSA”.',
        target: '[data-guide="investigar-pistas-header"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
        ensureVisible: { click: '[data-guide="investigar-tab-pistas"]' },
      },
      {
        id: 'investigar.ayudas.tab',
        title: 'Ayudas',
        body: 'Cambiá a “ayudas” para usar herramientas. Tenés un máximo de 3 por caso: usalas cuando te trabes.',
        target: '[data-guide="investigar-tab-ayudas"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
      },
      {
        id: 'investigar.ayudas.panel',
        title: 'Herramientas de investigación',
        body: 'Acá aparecen tus herramientas. Algunas te dan información extra o te ayudan a confirmar sospechas.',
        target: '[data-guide="investigar-ayudas-header"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
        ensureVisible: { click: '[data-guide="investigar-tab-ayudas"]' },
      },
      {
        id: 'investigar.ayudas.usar',
        title: 'Presioná “ACTIVAR HERRAMIENTA”',
        body: 'Para usar una ayuda, presioná “ACTIVAR HERRAMIENTA”. Consumís 1 de tus 3 usos y recibís un resultado (pista extra o análisis).',
        target: '[data-guide="investigar-usar-ayuda"]',
        next: { type: 'end' },
        allowInteractionWithinTarget: true,
        ensureVisible: { click: '[data-guide="investigar-tab-ayudas"]' },
      },
    ],
    archivo: [
      {
        id: 'archivo.what',
        title: 'Archivo criminal',
        body: 'Este es el registro de expedientes. Cada caso cerrado queda asentado con su estado.',
        target: '[data-guide="archivo-root"]',
        next: { type: 'next' },
        presentation: 'modal',
      },
      {
        id: 'archivo.filters',
        title: 'Filtros y búsqueda',
        body: 'Usá filtros para separar resueltos, pendientes, fallidos o abandonados. La lectura rápida importa.',
        target: '#buscar-casos',
        next: { type: 'next' },
      },
      {
        id: 'archivo.stats',
        title: 'Estadísticas',
        body: 'Tu rendimiento queda visible. No es un juego de intentos: es un expediente.',
        target: '[data-guide="archivo-stats-card"]',
        next: { type: 'next' },
      },
      {
        id: 'archivo.exportar',
        title: 'Exportar historial',
        body: 'Descargá el historial para guardarlo o compartirlo. Útil si querés comparar casos resueltos.',
        target: '[data-guide="archivo-exportar"]',
        next: { type: 'next' },
        allowInteractionWithinTarget: true,
      },
      {
        id: 'archivo.limpiar',
        title: 'Limpiar archivo',
        body: 'Esto borra el historial del archivo en este dispositivo. Usalo sólo si querés empezar de cero.',
        target: '[data-guide="archivo-limpiar"]',
        next: { type: 'end' },
        allowInteractionWithinTarget: true,
      },
    ],
  };
};

const getPathname = () => {
  try {
    return window.location.pathname;
  } catch {
    return '/';
  }
};

const resolveStepsForPath = (
  guideId: GuideId,
  pathname: string,
  all: Record<GuideId, GuideStep[]>
) => {
  if (guideId === 'home' && pathname === '/') return all[guideId] || [];
  if (guideId === 'nuevo-caso' && pathname.startsWith('/nuevo-caso')) return all[guideId] || [];
  if (guideId === 'investigar' && pathname.startsWith('/investigar')) return all[guideId] || [];
  if (guideId === 'archivo' && pathname.startsWith('/archivo')) return all[guideId] || [];
  return [];
};

const SpotlightOverlay: React.FC<{
  targetRect: DOMRect;
  title: string;
  body: string;
  onNext: () => void;
  onExit: () => void;
  showNextLabel: string;
  allowInteractionWithinTarget?: boolean;
}> = ({ targetRect, title, body, onNext, onExit, showNextLabel, allowInteractionWithinTarget }) => {
  const padding = 10;
  const x = Math.max(0, targetRect.left - padding);
  const y = Math.max(0, targetRect.top - padding);
  const w = Math.min(window.innerWidth - x, targetRect.width + padding * 2);
  const h = Math.min(window.innerHeight - y, targetRect.height + padding * 2);

  const panelWidth = 520;
  const panelMaxWidth = Math.min(panelWidth, window.innerWidth - 32);
  const panelHeight = 220;
  const margin = 16;

  const spaceAbove = y - margin;
  const spaceBelow = window.innerHeight - (y + h) - margin;
  const spaceRight = window.innerWidth - (x + w) - margin;
  const spaceLeft = x - margin;

  let panelLeft = Math.max(margin, (window.innerWidth - panelMaxWidth) / 2);
  let panelTop = Math.max(margin, (window.innerHeight - panelHeight) / 2);

  // Prefer vertical placement (above/below) so the highlighted target stays visible.
  if (spaceBelow >= panelHeight) {
    panelTop = y + h + margin;
    panelLeft = Math.min(
      window.innerWidth - panelMaxWidth - margin,
      Math.max(margin, x + w / 2 - panelMaxWidth / 2)
    );
  } else if (spaceAbove >= panelHeight) {
    panelTop = y - panelHeight - margin;
    panelLeft = Math.min(
      window.innerWidth - panelMaxWidth - margin,
      Math.max(margin, x + w / 2 - panelMaxWidth / 2)
    );
  } else if (spaceRight >= panelMaxWidth) {
    panelLeft = x + w + margin;
    panelTop = Math.min(
      window.innerHeight - panelHeight - margin,
      Math.max(margin, y + h / 2 - panelHeight / 2)
    );
  } else if (spaceLeft >= panelMaxWidth) {
    panelLeft = x - panelMaxWidth - margin;
    panelTop = Math.min(
      window.innerHeight - panelHeight - margin,
      Math.max(margin, y + h / 2 - panelHeight / 2)
    );
  }

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Bloqueadores alrededor del objetivo (hueco real) */}
      <div
        className="absolute bg-black/70 backdrop-blur-sm z-[9999]"
        style={{ left: 0, top: 0, width: '100%', height: y }}
      />
      <div
        className="absolute bg-black/70 backdrop-blur-sm z-[9999]"
        style={{ left: 0, top: y + h, width: '100%', height: Math.max(0, window.innerHeight - (y + h)) }}
      />
      <div
        className="absolute bg-black/70 backdrop-blur-sm z-[9999]"
        style={{ left: 0, top: y, width: x, height: h }}
      />
      <div
        className="absolute bg-black/70 backdrop-blur-sm z-[9999]"
        style={{ left: x + w, top: y, width: Math.max(0, window.innerWidth - (x + w)), height: h }}
      />

      {!allowInteractionWithinTarget && (
        <div
          className="absolute z-[10000] bg-transparent"
          style={{ left: x, top: y, width: w, height: h }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      )}

      {/* Marco de spotlight (arriba del hueco) */}
      <div
        className="absolute rounded-xl ring-2 ring-acento-azul/40 z-[10000] pointer-events-none"
        style={{ left: x, top: y, width: w, height: h }}
      />

      {/* Panel narrativo (se reubica para no tapar el objetivo) */}
      <div className="absolute z-[10001]" style={{ left: panelLeft, top: panelTop, width: panelMaxWidth }}>
        <div className="rounded-2xl border border-fondo-borde/60 bg-gradient-to-br from-fondo-panel via-fondo-panel to-fondo-secundario shadow-2xl">
          <div className="p-5 border-b border-fondo-borde/40 bg-fondo-secundario/20">
            <div className="text-[11px] font-mono tracking-[0.28em] text-acento-azul/80 uppercase">Guía de campo</div>
            <div className="mt-2 text-xl font-serif text-texto-principal">{title}</div>
          </div>
          <div className="p-5">
            <div className="text-sm text-texto-secundario leading-relaxed">{body}</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={onExit}
                className="py-3 rounded-xl border border-fondo-borde/60 bg-fondo-secundario/20 text-texto-principal hover:bg-white/5 transition-colors font-medium"
              >
                Cerrar
              </button>
              <button
                onClick={onNext}
                className="py-3 rounded-xl bg-gradient-to-r from-acento-azul to-acento-turquesa text-fondo-principal font-bold hover:opacity-95 transition-opacity"
              >
                {showNextLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalOverlay: React.FC<{
  title: string;
  body: string;
  onNext: () => void;
  onExit: () => void;
  showNextLabel: string;
}> = ({ title, body, onNext, onExit, showNextLabel }) => {
  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/90" />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-[560px] max-w-[calc(100vw-32px)] rounded-2xl border border-fondo-borde/60 bg-gradient-to-br from-fondo-panel via-fondo-panel to-fondo-secundario shadow-2xl">
          <div className="p-5 border-b border-fondo-borde/40 bg-fondo-secundario/20">
            <div className="text-[11px] font-mono tracking-[0.28em] text-acento-azul/80 uppercase">Guía de campo</div>
            <div className="mt-2 text-xl font-serif text-texto-principal">{title}</div>
          </div>
          <div className="p-5">
            <div className="text-sm text-texto-secundario leading-relaxed">{body}</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={onExit}
                className="py-3 rounded-xl border border-fondo-borde/60 bg-fondo-secundario/20 text-texto-principal hover:bg-white/5 transition-colors font-medium"
              >
                Cerrar
              </button>
              <button
                onClick={onNext}
                className="py-3 rounded-xl bg-gradient-to-r from-acento-azul to-acento-turquesa text-fondo-principal font-bold hover:opacity-95 transition-opacity"
              >
                {showNextLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuideHost: React.FC = () => {
  const guides = useMemo(() => getGuideDefinitions(), []);
  const [active, setActive] = useState<ActiveGuideState | null>(null);
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);
  const tickRafRef = useRef<number | null>(null);
  const highlightedRef = useRef<{
    el: HTMLElement;
    style: Partial<CSSStyleDeclaration>;
  } | null>(null);

  const scheduleTick = () => {
    if (tickRafRef.current) return;
    tickRafRef.current = requestAnimationFrame(() => {
      tickRafRef.current = null;
      setTick((t) => t + 1);
    });
  };

  useEffect(() => {
    if (!active) return;

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventKeys = (e: KeyboardEvent) => {
      const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'];
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeys);

    return () => {
      window.removeEventListener('wheel', preventScroll as any);
      window.removeEventListener('touchmove', preventScroll as any);
      window.removeEventListener('keydown', preventKeys);
    };
  }, [active?.guideId]);

  useEffect(() => {
    (window as any).__yoNoFuiGuide = {
      mounted: true,
      start: (guideId: GuideId) => {
        window.dispatchEvent(
          new CustomEvent(GUIDE_EVENT, {
            detail: { type: 'start', guideId, scope: 'full' },
          })
        );
        try {
          localStorage.setItem(
            LS_GUIDE_REQUEST,
            JSON.stringify({ type: 'start', guideId, scope: 'full' })
          );
        } catch {
          // ignore
        }
      },
      stop: () => {
        window.dispatchEvent(
          new CustomEvent(GUIDE_EVENT, {
            detail: { type: 'stop' },
          })
        );
        try {
          localStorage.setItem(LS_GUIDE_REQUEST, JSON.stringify({ type: 'stop' }));
        } catch {
          // ignore
        }
      },
    };

    return () => {
      try {
        if ((window as any).__yoNoFuiGuide?.mounted) {
          (window as any).__yoNoFuiGuide = null;
        }
      } catch {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    const existingRaw = readJson<any>(LS_ACTIVE);
    if (existingRaw) {
      const guideId = existingRaw?.guideId;
      const stepIndex = Number(existingRaw?.stepIndex || 0);

      // Migrate legacy IDs (e.g. older versions used 'onboarding')
      const migratedGuideId: GuideId | null =
        guideId === 'onboarding'
          ? 'home'
          : guideId === 'newcase'
            ? 'nuevo-caso'
            : guideId;

      if (migratedGuideId && migratedGuideId in guides) {
        const nextState: ActiveGuideState = { guideId: migratedGuideId as GuideId, stepIndex };
        writeJson(LS_ACTIVE, nextState);
        setActive(nextState);
      } else {
        clearKey(LS_ACTIVE);
      }
    }

    const onboardingDone = localStorage.getItem(LS_ONBOARDING_DONE) === '1';
    if (!onboardingDone) {
      const pathname = getPathname();
      if (pathname === '/') {
        const start: ActiveGuideState = { guideId: 'home', stepIndex: 0 };
        writeJson(LS_ACTIVE, start);
        setActive(start);
      }
    }
  }, []);

  useEffect(() => {
    const handler = (evt: Event) => {
      const custom = evt as CustomEvent<GuideRequest>;
      const detail = custom.detail;
      if (!detail) return;

      if (detail.type === 'stop') {
        clearKey(LS_GUIDE_REQUEST);
        clearKey(LS_ACTIVE);
        setActive(null);
        return;
      }

      if (detail.type === 'start') {
        const start: ActiveGuideState = { guideId: detail.guideId, stepIndex: 0 };
        writeJson(LS_ACTIVE, start);
        setActive(start);
      }
    };

    window.addEventListener(GUIDE_EVENT, handler);
    return () => window.removeEventListener(GUIDE_EVENT, handler);
  }, [guides]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const req = readJson<GuideRequest>(LS_GUIDE_REQUEST);
      if (!req) return;

      if (req.type === 'stop') {
        clearKey(LS_GUIDE_REQUEST);
        clearKey(LS_ACTIVE);
        setActive(null);
        return;
      }

      if (req.type === 'start') {
        clearKey(LS_GUIDE_REQUEST);
        const start: ActiveGuideState = { guideId: req.guideId, stepIndex: 0 };
        writeJson(LS_ACTIVE, start);
        setActive(start);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!active) return;

    writeJson(LS_ACTIVE, active);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setTick((t) => t + 1));

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const onResize = () => scheduleTick();
    const onScroll = () => scheduleTick();

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    scheduleTick();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [active?.guideId]);

  const derived = useMemo(() => {
    const pathname = getPathname();
    const guideId = active?.guideId;

    const stepsForPage = guideId
      ? resolveStepsForPath(guideId, pathname, guides)
      : [];

    const stepIndex =
      stepsForPage.length > 0
        ? Math.min(active?.stepIndex ?? 0, stepsForPage.length - 1)
        : 0;

    const step = stepsForPage.length > 0 ? stepsForPage[stepIndex] : null;

    const targetEl = step
      ? (document.querySelector(step.target) as HTMLElement | null)
      : null;
    const rect = targetEl?.getBoundingClientRect() ?? null;

    const targetOk = !!targetEl && !!rect && rect.width > 0 && rect.height > 0;

    return {
      pathname,
      stepsForPage,
      stepIndex,
      step,
      targetEl,
      rect,
      targetOk,
    };
  }, [active?.guideId, active?.stepIndex, guides, tick]);

  useEffect(() => {
    if (!active || !derived.step) return;

    const clickSelector = derived.step.ensureVisible?.click;
    if (!clickSelector) return;

    try {
      const el = document.querySelector(clickSelector) as HTMLElement | null;
      if (!el) return;
      el.click();
      scheduleTick();
    } catch {
      // ignore
    }
  }, [active?.guideId, active?.stepIndex, derived.step?.id]);

  useEffect(() => {
    // Cleanup previous highlight
    if (highlightedRef.current) {
      const prev = highlightedRef.current;
      prev.el.style.transform = prev.style.transform || '';
      prev.el.style.transition = prev.style.transition || '';
      prev.el.style.position = prev.style.position || '';
      prev.el.style.zIndex = prev.style.zIndex || '';
      prev.el.style.boxShadow = prev.style.boxShadow || '';
      prev.el.style.borderRadius = prev.style.borderRadius || '';
      highlightedRef.current = null;
    }

    if (!active) return;
    if (!derived.targetEl) return;

    // Always snap to the target element.
    // We lock user scroll while the guide is active, so the guide itself is responsible for positioning.
    try {
      derived.targetEl.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
      scheduleTick();
      requestAnimationFrame(() => scheduleTick());
    } catch {
      // ignore
    }

    // Highlight / growth effect
    const prevStyle: Partial<CSSStyleDeclaration> = {
      transform: derived.targetEl.style.transform,
      transition: derived.targetEl.style.transition,
      position: derived.targetEl.style.position,
      zIndex: derived.targetEl.style.zIndex,
      boxShadow: derived.targetEl.style.boxShadow,
      borderRadius: derived.targetEl.style.borderRadius,
    };
    highlightedRef.current = { el: derived.targetEl, style: prevStyle };

    if (!derived.targetEl.style.position) derived.targetEl.style.position = 'relative';
    derived.targetEl.style.transition = '';
    derived.targetEl.style.transform = '';
    derived.targetEl.style.borderRadius = derived.targetEl.style.borderRadius || '14px';
    derived.targetEl.style.boxShadow = '0 0 0 2px rgba(75, 172, 255, 0.35), 0 12px 30px rgba(0, 0, 0, 0.45)';

    return () => {
      if (highlightedRef.current?.el === derived.targetEl) {
        derived.targetEl.style.transform = prevStyle.transform || '';
        derived.targetEl.style.transition = prevStyle.transition || '';
        derived.targetEl.style.position = prevStyle.position || '';
        derived.targetEl.style.zIndex = prevStyle.zIndex || '';
        derived.targetEl.style.boxShadow = prevStyle.boxShadow || '';
        derived.targetEl.style.borderRadius = prevStyle.borderRadius || '';
        highlightedRef.current = null;
      }
    };
  }, [active?.guideId, derived.pathname, derived.step?.id, derived.targetEl]);

  useEffect(() => {
    if (!active) return;
    scheduleTick();
  }, [active?.guideId, active?.stepIndex]);

  const advance = () => {
    if (!active || !derived.step) return;

    const next = derived.step.next || { type: 'end' as const };

    if (next.type === 'end') {
      if (active.guideId === 'home') {
        localStorage.setItem(LS_ONBOARDING_DONE, '1');
      }
      clearKey(LS_ACTIVE);
      setActive(null);
      return;
    }

    setActive({ ...active, stepIndex: derived.stepIndex + 1 });
  };

  const exit = () => {
    if (highlightedRef.current) {
      const prev = highlightedRef.current;
      prev.el.style.transform = prev.style.transform || '';
      prev.el.style.transition = prev.style.transition || '';
      prev.el.style.position = prev.style.position || '';
      prev.el.style.zIndex = prev.style.zIndex || '';
      prev.el.style.boxShadow = prev.style.boxShadow || '';
      prev.el.style.borderRadius = prev.style.borderRadius || '';
      highlightedRef.current = null;
    }
    clearKey(LS_ACTIVE);
    setActive(null);
  };

  if (!active || derived.stepsForPage.length === 0 || !derived.step) {
    return null;
  }

  const nextLabelResolved = derived.step.next?.type === 'end' ? 'Cerrar expediente' : 'Siguiente';

  if (derived.step.presentation === 'modal') {
    return (
      <ModalOverlay
        title={derived.step.title}
        body={derived.step.body}
        onNext={advance}
        onExit={exit}
        showNextLabel={nextLabelResolved}
      />
    );
  }

  if (!derived.targetOk || !derived.rect) {
    return (
      <div className="fixed inset-0 z-[200]">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-[520px] max-w-[calc(100vw-32px)] rounded-2xl border border-fondo-borde/60 bg-gradient-to-br from-fondo-panel via-fondo-panel to-fondo-secundario shadow-2xl">
            <div className="p-5 border-b border-fondo-borde/40 bg-fondo-secundario/20">
              <div className="text-[11px] font-mono tracking-[0.28em] text-acento-azul/80 uppercase">Guía de campo</div>
              <div className="mt-2 text-xl font-serif text-texto-principal">Preparando guía…</div>
            </div>
            <div className="p-5">
              <div className="text-sm text-texto-secundario leading-relaxed">
                Estoy buscando el elemento que tengo que resaltar. Si esta vista todavía está cargando, en un instante aparece.
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={exit}
                  className="py-3 rounded-xl border border-fondo-borde/60 bg-fondo-secundario/20 text-texto-principal hover:bg-white/5 transition-colors font-medium"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setTick((t) => t + 1)}
                  className="py-3 rounded-xl bg-gradient-to-r from-acento-azul to-acento-turquesa text-fondo-principal font-bold hover:opacity-95 transition-opacity"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SpotlightOverlay
      key={`${active.guideId}:${derived.pathname}:${derived.step.id}`}
      targetRect={derived.rect}
      title={derived.step.title}
      body={derived.step.body}
      onNext={advance}
      onExit={exit}
      showNextLabel={nextLabelResolved}
      allowInteractionWithinTarget={derived.step.allowInteractionWithinTarget}
    />
  );
};

export default GuideHost;
