import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import { casosFaciles } from '../../data/casos/casosFaciles';
import { casosMedios } from '../../data/casos/casosMedios';
import { casosDificiles } from '../../data/casos/casosDificiles';

const apiKey = process.env.OPENAI_API_KEY;
const openAIModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const hasOpenAIKey = !!apiKey;

console.log(`Configuración OpenAI: ${hasOpenAIKey ? 'Key encontrada' : 'Key NO encontrada'}`);

let openai: OpenAI | null = null;
if (hasOpenAIKey) {
  openai = new OpenAI({ apiKey });
} else {
  console.warn("⚠️ Ejecutando en modo OFFLINE/DEMO. Configura OPENAI_API_KEY en .env para generar casos con IA.");
}

const getCasosPorDificultad = (dificultad: string) => {
  switch (dificultad.toLowerCase()) {
    case 'fácil':
    case 'facil':
      return casosFaciles;
    case 'difícil':
    case 'dificil':
      return casosDificiles;
    case 'media':
    default:
      return casosMedios;
  }
};

export const POST: APIRoute = async ({ request }) => {
  // Inicializamos variables fuera del try para usarlas en el catch
  let dificultad = 'media';
  let aiAttempted = false;
  let aiUsed = false;
  let aiError: string | null = null;

  try {
    const body = await request.json().catch(() => ({}));
    const { 
      tema = '', 
      jugadores = 2,
      tono = 'policial-realista',
      longitud = 'larga'
    } = body;
    
    // Actualizamos la dificultad si viene en el body
    if (body.dificultad) dificultad = body.dificultad;

    let casoGenerado;

    // INTENTO DE GENERAR CON AI (Solo si hay key y no es petición explícita de offline)
    if (openai && hasOpenAIKey && tema !== 'offline') {
      aiAttempted = true;
      console.log("Generando caso con OpenAI...");
      const completion = await openai.chat.completions.create({
        model: openAIModel,
        messages: [
          {
            role: "system",
            content: `Eres un escritor de misterios y un guionista policial. Genera un caso criminal en español en formato JSON.

            OBJETIVO DE CALIDAD (muy importante):
            - La historia debe sentirse como un caso "real" y llevadero, con buen ritmo, tensión y detalles, similar a un relato corto policial.
            - "historia" debe ser LARGA (mínimo 6 párrafos si longitud="larga"). Incluir: disparador del caso, contexto social/político si aplica, rutinas/horarios, y pequeñas contradicciones.
            - Evita genéricos. Usa nombres y detalles concretos (lugares, objetos, gestos, sonidos, clima, etc.).
            - La solución debe ser razonable: que las pistas + ayudas permitan inferir al culpable sin magia.
            - No uses meta-texto (no digas "como IA"), no incluyas markdown, no incluyas texto fuera del JSON.

            RECURSOS NARRATIVOS (para que sea más "llevadero"):
            - Incluye 2 a 4 líneas de diálogo muy cortas dentro de la historia (entre comillas), repartidas en la historia (no seguidas).
            - Incluye al menos 1 escena sensorial: sonido/olor/temperatura/luz.
            - Incluye una referencia a horarios (ej: 22:10, 23:45) para que el jugador pueda reconstruir la secuencia.

            COMPLEJIDAD CONTROLADA (para que sea más inteligente):
            - Incluye 1 señuelo (red herring) que parezca incriminar a un sospechoso distinto del culpable, pero que tenga explicación.
            - En dificultad "difícil" agrega además una contradicción menor en una coartada que se explica con una ayuda.

            REGLAS DE JUEGO:
            - Exactamente 3 sospechosos.
            - Exactamente 3 pistas (cada pista debe ser accionable y específica; no abstracta).
            - Exactamente 3 ayudas, y cada ayuda debe devolver un "resultado" realmente útil (no genérico).
            - El culpable debe ser UNO de los sospechosos y su "culpableId" debe coincidir con el id de ese sospechoso.
            - Incluye un giro final satisfactorio ("giroFinal") que conecte motivación + oportunidad + método.
            - Dificultad afecta: claridad de pistas (fácil), ambigüedad razonable (media), señuelos/contradicciones (difícil).

            ESTRUCTURA REQUERIDA (JSON):
            {
              "titulo": "string",
              "historia": "string",
              "ambientacion": "string",
              "dificultad": "fácil|media|difícil",
              "jugadores": number,
              "sospechosos": [{
                "id": "string",
                "nombre": "string",
                "descripcion": "string",
                "motivacion": "string",
                "alibi": "string"
              }],
              "pistas": [{
                "id": "string",
                "titulo": "string",
                "descripcion": "string",
                "relevancia": "alta|media|baja",
                "descubierta": false,
                "tipo": "física|testimonio|digital|documento"
              }],
              "ayudas": [{
                "id": "string",
                "nombre": "string",
                "descripcion": "string",
                "resultado": "string"
              }],
              "giroFinal": "string",
              "culpableId": "string",
              "maxPistas": 3
            }
            }`,
          },
          {
            role: "user",
            content: `Genera un misterio para ${jugadores} jugadores con dificultad ${dificultad}. ${tema ? `Tema: ${tema}` : ''} Tono: ${tono}. Longitud: ${longitud}. Responde SOLAMENTE con el JSON raw.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.85,
        max_tokens: 3500,
      });

      const content = completion.choices[0].message.content || '{}';

      casoGenerado = JSON.parse(content);
      casoGenerado.source = 'openai';
      aiUsed = true;
    } else {
      // MODO OFFLINE / FALLBACK MANUAL
      console.log(`Modo offline: seleccionando caso ${dificultad}`);
      const casosDisponibles = getCasosPorDificultad(dificultad);
      const randomIndex = Math.floor(Math.random() * casosDisponibles.length);
      casoGenerado = { ...casosDisponibles[randomIndex], source: 'example' };
    }

    // Validar y completar estructura
    if (!casoGenerado || typeof casoGenerado !== 'object') {
      throw new Error('Respuesta inválida del generador');
    }

    if (!casoGenerado.titulo || !casoGenerado.historia || !casoGenerado.ambientacion) {
      throw new Error('Caso incompleto generado por IA');
    }

    casoGenerado = {
      ...casoGenerado,
      id: `caso_${Date.now()}`,
      dificultad: dificultad,
      jugadores: parseInt(jugadores as any) || 2,
      pistasSolicitadas: 0,
      maxPistas: 3,
      resuelto: false,
      creadoEn: new Date().toISOString(),
      aiUsed,
      aiAttempted,
      aiModel: openAIModel,
      aiHasKey: hasOpenAIKey
    };

    // Asegurar arrays
    casoGenerado.sospechosos = Array.isArray(casoGenerado.sospechosos) ? casoGenerado.sospechosos : [];
    casoGenerado.pistas = Array.isArray(casoGenerado.pistas) ? casoGenerado.pistas : [];
    casoGenerado.ayudas = Array.isArray(casoGenerado.ayudas) ? casoGenerado.ayudas : [];

    // Asignar IDs únicos
    casoGenerado.sospechosos.forEach((s: any, i: number) => {
      s.id = s.id || `sospechoso_${i + 1}`;
    });

    casoGenerado.pistas.forEach((p: any, i: number) => {
      p.id = p.id || `pista_${i + 1}`;
      p.descubierta = false;
      if (typeof p.confiable !== 'boolean') p.confiable = true;
      if (!Array.isArray(p.sospechososVinculados)) p.sospechososVinculados = [];
      if (!p.relevancia) p.relevancia = 'media';
    });

    casoGenerado.ayudas.forEach((a: any, i: number) => {
      a.id = a.id || `ayuda_${i + 1}`;
      a.disponible = true;
      if (!a.resultado) a.resultado = "El análisis no arrojó resultados concluyentes, pero confirma las sospechas previas.";
    });

    // Elegir culpable si no existe
    if (!casoGenerado.culpableId && casoGenerado.sospechosos.length > 0) {
      casoGenerado.culpableId = casoGenerado.sospechosos[0].id;
    }

    return new Response(JSON.stringify(casoGenerado), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    aiError = error?.message || String(error);
    console.error('Error detallado OpenAI:', aiError);
    
    // Fallback en caso de error de API
    const casosDisponibles = getCasosPorDificultad(dificultad);
    const randomIndex = Math.floor(Math.random() * casosDisponibles.length);
    
    const casoFallback = {
        ...casosDisponibles[randomIndex],
        id: `caso_fallback_${Date.now()}`,
        resuelto: false,
        esFallback: true,
        source: 'fallback',
        errorOriginal: aiError || 'Error desconocido',
        creadoEn: new Date().toISOString(),
        jugadores: 2,
        dificultad: dificultad, // Asegurar que coincida
        aiUsed: false,
        aiAttempted,
        aiModel: openAIModel,
        aiHasKey: hasOpenAIKey
    };
    
    return new Response(JSON.stringify(casoFallback), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};