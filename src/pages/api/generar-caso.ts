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
      jugadores = 2 
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
            content: `Eres un escritor de misterios. Genera un caso criminal en español en formato JSON. 
            Estructura requerida:
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
                "tipo": "física|testimonio|digital"
              }],
              "ayudas": [{
                "id": "string",
                "nombre": "string (ej: Análisis Forense)",
                "descripcion": "string (ej: Buscar huellas)",
                "resultado": "string (La información revelada al usar esta ayuda)"
              }],
              "giroFinal": "string",
              "culpableId": "string",
              "maxPistas": 3
            }
            Asegúrate de generar al menos 3 pistas y exactamente 3 ayudas que revelen información crucial.`
          },
          {
            role: "user",
            content: `Genera un misterio para ${jugadores} jugadores con dificultad ${dificultad}. ${tema ? `Tema: ${tema}` : ''} Responde SOLAMENTE con el JSON raw.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 2500,
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
    casoGenerado.sospechosos = casoGenerado.sospechosos || [];
    casoGenerado.pistas = casoGenerado.pistas || [];
    casoGenerado.ayudas = casoGenerado.ayudas || [];

    // Asignar IDs únicos
    casoGenerado.sospechosos.forEach((s: any, i: number) => {
      s.id = s.id || `sospechoso_${i + 1}`;
    });

    casoGenerado.pistas.forEach((p: any, i: number) => {
      p.id = p.id || `pista_${i + 1}`;
      p.descubierta = false;
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